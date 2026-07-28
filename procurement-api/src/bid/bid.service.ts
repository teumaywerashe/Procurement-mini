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
import type { JwtPayload } from '../auth/decorators/current-user.decorator';
import { eq } from 'drizzle-orm';
@Injectable()
export class BidService {
  async create(createBidDto: CreateBidDto, user: JwtPayload) {
    const [createdBid] = await db
      .insert(bid)
      .values({
        ...createBidDto,
        vendorId: user.uid,
        referenceNumber: `RF-BID-${Date.now()}${user.uid}`,
      })
      .returning();
    return createdBid;
  }

  async findAll() {
    return await db.select().from(bid);
  }
  async findByVendorId(vendorId: number) {
    return await db.select().from(bid).where(eq(bid.vendorId, vendorId));
  }

  async findByTenderId(tenderId: number) {
    return await db.select().from(bid).where(eq(bid.tenderId, tenderId));
  }

  async findOne(id: number) {
    const [bidById] = await db.select().from(bid).where(eq(bid.id, id));
    if (!bidById) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
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
    if (foundBid.vendorId !== user.uid) {
      throw new UnauthorizedException(
        `Vendor ID mismatch. Cannot update bid with a different vendor ID.`,
      );
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
    if (foundBid.vendorId !== user.uid) {
      throw new UnauthorizedException(
        `Vendor ID mismatch. Cannot delete bid with a different vendor ID.`,
      );
    }

    return await db.delete(bid).where(eq(bid.id, id)).returning();
  }
}
