import { Injectable } from '@nestjs/common';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import { JwtPayload } from '../auth/decorators/types';
import { db } from '../database/db';
import { tender } from '../database/schema/tender.schema';
import { eq, and, desc, ilike, lte, gte } from 'drizzle-orm';
import { TenderFilterDto } from './dto/tender-filter.dto';

@Injectable()
export class TenderService {
  async create(createTenderDto: CreateTenderDto, user: JwtPayload) {
    const [newTender] = await db
      .insert(tender)
      .values({
        ...createTenderDto,
        createdBy: user.uid,
        referenceNumber: `Tender-${new Date().getTime()}`,
      })
      .returning()
      .execute();
    return newTender;
  }

  async findAll() {
    return await db
      .select()
      .from(tender)
      .orderBy(desc(tender.createdAt))
      .execute()
      .then(async (tenders) => {
        // Use RQB to get bids for each tender
        const withBids = await db.query.tender.findMany({
          with: { bids: true },
        });
        const bidsMap = new Map(withBids.map((t) => [t.id, t.bids]));
        return tenders.map((t) => ({ ...t, bids: bidsMap.get(t.id) ?? [] }));
      });
  }

  async findAllByFilter(filter: TenderFilterDto) {
    const conditions: ReturnType<typeof ilike>[] = [];

    if (filter.title) {
      conditions.push(ilike(tender.title, `%${filter.title}%`));
    }

    if (filter.minPrice !== undefined) {
      conditions.push(gte(tender.estimatedValue, filter.minPrice));
    }

    if (filter.maxPrice !== undefined) {
      conditions.push(lte(tender.estimatedValue, filter.maxPrice));
    }

    const tenders = await db
      .select()
      .from(tender)
      .orderBy(desc(tender.createdAt))
      .where(conditions.length ? and(...conditions) : undefined)
      .execute();

    const ids = tenders.map((t) => t.id);
    if (ids.length === 0) return [];

    const withBids = await db.query.tender.findMany({
      with: { bids: true },
    });
    const bidsMap = new Map(withBids.map((t) => [t.id, t.bids]));
    return tenders.map((t) => ({ ...t, bids: bidsMap.get(t.id) ?? [] }));
  }

  async findOne(id: number) {
    return await db.query.tender.findFirst({
      where: { id },
      with: { bids: true },
    });
  }

  async update(id: number, updateTenderDto: UpdateTenderDto) {
    const [updatedTender] = await db
      .update(tender)
      .set(updateTenderDto)
      .where(eq(tender.id, id))
      .returning()
      .execute();
    return updatedTender;
  }

  async remove(id: number) {
    const [deletedTender] = await db
      .delete(tender)
      .where(eq(tender.id, id))
      .returning()
      .execute();
    return {
      deletedTender,
      success: true,
      message: 'Tender deleted successfully',
    };
  }
}
