import {
  BadRequestException,
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
    const [createdBid] = await db
      .insert(bid)
      .values({
        ...createBidDto,
        vendorId: creatingVendor.id,
        referenceNumber: `RF-BID-${Date.now()}${user.uid}`,
      })
      .returning();
    return createdBid;
  }

  async findAll() {
    return await db.select().from(bid);
  }
  async findByVendorId(vendorId: number) {
    const [existingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.ownerId, vendorId))
      .limit(1);
    if (!existingVendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }
    return await db
      .select()
      .from(bid)
      .where(eq(bid.vendorId, existingVendor.id));
  }

  async findByTenderId(tenderId: number) {
    return await db.select().from(bid).where(eq(bid.tenderId, tenderId));
  }

  async findOne(id: number) {
    const [bidById] = await db.select().from(bid).where(eq(bid.id, id));
    if (!bidById) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    console.log(bidById);
    return bidById;
  }

  async update(id: number, updateBidDto: UpdateBidDto) {
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
    const [updatingVendor] = await db
      .select()
      .from(vendor)
      .where(eq(vendor.id, foundBid.vendorId))
      .limit(1);
    if (!updatingVendor) {
      throw new UnauthorizedException('Vendor not found');
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
    return { deleted: deleted, success: true, message: 'deleted succefully' };
  }
}
