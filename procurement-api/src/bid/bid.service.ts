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

@Injectable()
export class BidService {
  async create(createBidDto: CreateBidDto, user: JwtPayload) {
    const [creatingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.ownerId, user.uid))
      .execute();
    if (!creatingVendor) {
      throw new UnauthorizedException(
        'You cant create a bid with user accound create a vendor first',
      );
    }
    try {
      const [createdBid] = await db
        .insert(bid)
        .values({
          ...createBidDto,
          vendorId: creatingVendor.id,
          referenceNumber: `RF-BID-${Date.now()}${user.uid}`,
        })
        .returning();
      return createdBid;
    } catch (err: any) {
      // PostgreSQL unique violation
      if (err?.code === '23505') {
        throw new ConflictException(
          'You have already submitted a bid for this tender',
        );
      }
      throw err;
    }
  }

  async findAll(user: JwtPayload) {
    // SUPER_ADMIN sees all bids system-wide
    if (user.role === UserRole.SUPER_ADMIN) {
      return await db.query.bid.findMany({
        with: { tender: true, vendor: true },
      });
    }
    // ADMIN sees bids only on their own tenders
    const adminTenders = await db.query.tender.findMany({
      where: { createdBy: user.uid },
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

  async findByVendorId(uid: number) {
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
      where: { vendorId: existingVendor.id },
      with: { tender: true, vendor: true },
    });
  }

  async findByTenderId(tenderId: number, user: JwtPayload) {
    const ownedTender = await db.query.tender.findFirst({
      where: { id: tenderId },
    });
    if (!ownedTender) {
      throw new NotFoundException(`Tender ${tenderId} not found`);
    }
    // SUPER_ADMIN can view bids on any tender; ADMIN can only view bids on their own tenders
    if (
      user.role !== UserRole.SUPER_ADMIN &&
      ownedTender.createdBy !== user.uid
    ) {
      throw new ForbiddenException(
        'You can only view bids on your own tenders',
      );
    }
    return await db.query.bid.findMany({
      where: { tenderId },
      with: { tender: true, vendor: true },
    });
  }

  async findOne(id: number, user: JwtPayload) {
    const bidById = await db.query.bid.findFirst({
      where: { id },
      with: { tender: true, vendor: true },
    });
    if (!bidById) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      return bidById;
    }
    if (user.role === UserRole.ADMIN) {
      if (bidById.tender?.createdBy !== user.uid) {
        throw new ForbiddenException(
          'You can only view bids applied to your own tenders',
        );
      }
      return bidById;
    }
    if (bidById.vendor?.ownerId !== user.uid) {
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
        where: { id: foundBid.tenderId },
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
        throw new ForbiddenException(
          'You are not allowed to update this bid.',
        );
      }
    }

    const [updatedBid] = await db
      .update(bid)
      .set(updateBidDto)
      .where(eq(bid.id, id))
      .returning();
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
      throw new UnauthorizedException('Vendor not found');
    }
    if (foundVendor.ownerId !== user.uid) {
      throw new UnauthorizedException(
        `Vendor ID mismatch. Cannot delete bid with a different vendor ID.`,
      );
    }
    const [deleted] = await db.delete(bid).where(eq(bid.id, id)).returning();
    return { deleted, success: true, message: 'deleted successfully' };
  }
}
