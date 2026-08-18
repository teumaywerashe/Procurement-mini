/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { bid } from '../database/schema/bid.schema';
import { db } from '../database/db';
import type { JwtPayload } from '../auth/decorators/types';
import { eq } from 'drizzle-orm';
import { vendor } from '../database/schema/vendor.schema';
import { tender } from '../database/schema/tender.schema';
import { UserRole } from '../user/enum/userRole.enum';
import { bidStatus } from './enum/bidStatus.enum';
import { RabbitMQService } from '../messaging/messaging.service';

@Injectable()
export class BidService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async create(createBidDto: CreateBidDto, user: JwtPayload) {
    const [existingTender] = await db
      .select()
      .from(tender)
      .where(eq(tender.id, createBidDto.tenderId))
      .execute();
    if (!existingTender) {
      throw new NotFoundException(
        `Tender with ID ${createBidDto.tenderId} not found`,
      );
    }
    if (user.role !== UserRole.VENDOR) {
      throw new ForbiddenException('Only vendors are allowed to create bids');
    }
    // console.log(existingTender);
    if (existingTender.status !== 'published') {
      throw new ForbiddenException(
        'You cannot create a bid for a tender that is not open',
      );
    }
    const [existingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.ownerId, user.uid))
      .execute();
    if (!existingVendor) {
      throw new UnauthorizedException(
        'You cant create a bid with user accound create a vendor first',
      );
    }
    try {
      const [createdBid] = await db
        .insert(bid)
        .values({
          ...createBidDto,
          vendorId: existingVendor.id,
          referenceNumber: `RF-BID-${Date.now()}${user.uid}`,
        })
        .returning();
      // console.log('Bid created successfully:', createdBid);
      await this.rabbitMQService.publishBidSubmitted({
        bidId: createdBid.id,
        tenderId: createdBid.tenderId,
        tenderTitle: existingTender.title,
        userId: existingVendor.ownerId,
        message: `Your bid for tender "${existingTender.title}" was submitted successfully.`,
      });
      await this.rabbitMQService.publishBidSubmitted({
        bidId: createdBid.id,
        tenderId: createdBid.tenderId,
        tenderTitle: existingTender.title,
        userId: existingTender.createdBy,
        message: `You received a new bid for tender "${existingTender.title}".`,
      });
      // console.log(result);
      return createdBid;
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException(
          'You have already submitted a bid for this tender',
        );
      }
      throw err;
    }
  }

  async findAll(user: JwtPayload) {
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('SuperAdmin is not permitted to view bids');
    }
    const adminTenders = await db.query.tender.findMany({
      where: { createdBy: user.uid } as any,
      with: {
        bids: {
          with: { vendor: true },
        },
      },
    });
    return adminTenders.flatMap((t) =>
      t.bids.map((b) => ({ ...b, tender: t })),
    );
  }

  async findMyBids(uid: number) {
    const existingVendor = await db
      .select()
      .from(vendor)
      .where(eq(vendor.ownerId, uid))
      .limit(1)
      .then((rows) => rows[0]);
    if (!existingVendor) {
      throw new NotFoundException(`Vendor with owner ID ${uid} not found`);
    }
    return await db.query.bid.findMany({
      where: { vendorId: existingVendor.id } as any,
      with: { tender: true, vendor: true },
    });
  }

  async findByTenderId(tenderId: number, user: JwtPayload) {
    const ownedTender = await db.query.tender.findFirst({
      where: { id: tenderId } as any,
    });
    if (!ownedTender) {
      throw new NotFoundException(`Tender ${tenderId} not found`);
    }
    if (
      user.role === UserRole.SUPER_ADMIN ||
      ownedTender.createdBy !== user.uid
    ) {
      throw new ForbiddenException(
        'You can only view bids on your own tenders',
      );
    }
    return await db.query.bid.findMany({
      where: { tenderId } as any,
      with: { tender: true, vendor: true },
    });
  }

  async findOne(id: number, user: JwtPayload) {
    const bidById = await db.query.bid.findFirst({
      where: { id } as any,
      with: { tender: true, vendor: true },
    });
    if (!bidById) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('SuperAdmin is not permitted to view bids');
    }
    if (user.role === UserRole.ADMIN) {
      if (bidById.tender?.createdBy !== user.uid) {
        throw new ForbiddenException(
          'You can only view bids applied to your own tenders',
        );
      }
      return bidById;
    }
    if (bidById.vendor?.ownerId != user.uid) {
      throw new ForbiddenException('You can only view your own bids');
    }
    return bidById;
  }

  async update(id: number, updateBidDto: UpdateBidDto, user: JwtPayload) {
    if (!id) {
      throw new BadRequestException('Bid ID is required for update');
    }
    const [foundBid] = await db
      .select()
      .from(bid)
      .where(eq(bid.id, id))
      .limit(1);
    if (!foundBid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    if (user.role === UserRole.ADMIN) {
      const ownedTender = await db.query.tender.findFirst({
        where: { id: foundBid.tenderId } as any,
      });
      if (!ownedTender || ownedTender.createdBy !== user.uid) {
        throw new ForbiddenException(
          'You can only update bids applied to your own tenders',
        );
      }
    } else if (user.role !== UserRole.SUPER_ADMIN) {
      const [updatingVendor] = await db
        .select()
        .from(vendor)
        .where(eq(vendor.id, foundBid.vendorId))
        .limit(1);
      if (!updatingVendor || updatingVendor.ownerId !== user.uid) {
        throw new ForbiddenException('You are not allowed to update this bid.');
      }
    }

    const [updatedBid] = await db
      .update(bid)
      .set(updateBidDto)
      .where(eq(bid.id, id))
      .returning();
    return updatedBid;
  }
  async updateStatus(id: number, status: bidStatus, user: JwtPayload) {
    if (!id) {
      throw new BadRequestException('Bid ID is required for update');
    }

    const [foundBid] = await db
      .select()
      .from(bid)
      .where(eq(bid.id, id))
      .limit(1);
    if (!foundBid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    if (user.role === UserRole.ADMIN) {
      const ownedTender = await db.query.tender.findFirst({
        where: { id: foundBid.tenderId } as any,
      });
      if (!ownedTender || ownedTender.createdBy !== user.uid) {
        throw new ForbiddenException(
          'You can only update bids applied to your own tenders',
        );
      }
    }

    const [updatedBid] = await db
      .update(bid)
      .set({ bidStatus: status })
      .where(eq(bid.id, id))
      .returning();
    const [bidVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.id, foundBid.vendorId))
      .limit(1);
    const updatedTender = await db.query.tender.findFirst({
      where: { id: foundBid.tenderId } as any,
    });
    if (bidVendor && updatedTender) {
      await this.rabbitMQService.publishBidStatusUpdated({
        bidId: updatedBid.id,
        tenderId: updatedBid.tenderId,
        tenderTitle: updatedTender.title,
        status: updatedBid.bidStatus,
        userId: bidVendor.ownerId,
        message: `Your bid for tender "${updatedTender.title}" was ${updatedBid.bidStatus}.`,
      });
    }
    return updatedBid;
  }
  async remove(id: number, user: JwtPayload) {
    if (!id) {
      throw new UnauthorizedException('Bid ID is required for deletion');
    }
    const [foundBid] = await db
      .select()
      .from(bid)
      .where(eq(bid.id, id))
      .limit(1);
    if (!foundBid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    const [foundVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.id, foundBid.vendorId))
      .limit(1);
    if (!foundVendor) {
      throw new NotFoundException('Vendor not found');
    }
    if (foundVendor.ownerId !== user.uid && user.role !== UserRole.ADMIN) {
      throw new BadRequestException(
        `Vendor ID mismatch. Cannot delete bid with a different vendor ID.`,
      );
    }
    const [deleted] = await db.delete(bid).where(eq(bid.id, id)).returning();
    return { deleted, success: true, message: 'deleted successfully' };
  }
}
