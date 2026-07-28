import { Injectable } from '@nestjs/common';
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

  async findOne(id: number) {
    const [bidById] = await db.select().from(bid).where(eq(bid.id, id));
    return bidById;
  }

  async update(id: number, updateBidDto: UpdateBidDto) {
    if (!id) {
      throw new Error('Bid ID is required for update');
    }
    const [foundBid] = await db
      .select()
      .from(bid)
      .where(eq(bid.id, id))
      .limit(1);
    if (!foundBid) {
      throw new Error(`Bid with ID ${id} not found`);
    }
    const [updatedBid] = await db
      .update(bid)
      .set(updateBidDto)
      .where(eq(bid.id, id))
      .returning();
    return updatedBid;
  }

  async remove(id: number) {
    if (!id) {
      throw new Error('Bid ID is required for deletion');
    }
    const [foundBid] = await db
      .select()
      .from(bid)
      .where(eq(bid.id, id))
      .limit(1);
    if (!foundBid) {
      throw new Error(`Bid with ID ${id} not found`);
    }

    return await db.delete(bid).where(eq(bid.id, id)).returning();
  }
}
