import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import type { JwtPayload } from '../auth/decorators/types';
import { db } from '../database/db';
import { tender } from '../database/schema/tender.schema';
import { eq, and, desc, ilike, lte, gte, SQL } from 'drizzle-orm';
import { TenderFilterDto } from './dto/tender-filter.dto';
import { UserRole } from '../user/enum/userRole..enum';

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

  async findAll(user: JwtPayload) {
    const isAdmin = user.role === UserRole.ADMIN;

    const tenders = await db
      .select()
      .from(tender)
      .where(isAdmin ? eq(tender.createdBy, user.uid) : undefined)
      .orderBy(desc(tender.createdAt))
      .execute();

    if (!isAdmin) return tenders;

    // Attach bids + user for admin's own tenders
    const withBids = await db.query.tender.findMany({
      where: { createdBy: user.uid },
      with: { bids: true, user: true },
    });
    const metaMap = new Map(
      withBids.map((t) => [t.id, { bids: t.bids, user: t.user }]),
    );
    return tenders.map((t) => ({ ...t, ...metaMap.get(t.id) }));
  }

  async findAllByFilter(filter: TenderFilterDto, user: JwtPayload) {
    const isAdmin = user.role === UserRole.ADMIN;
    const conditions: SQL[] = [];

    if (isAdmin) {
      conditions.push(eq(tender.createdBy, user.uid));
    }

    if (filter.title) {
      conditions.push(ilike(tender.title, `%${filter.title}%`));
    }
    if (filter.minPrice !== undefined) {
      conditions.push(gte(tender.estimatedValue, filter.minPrice));
    }
    if (filter.maxPrice !== undefined) {
      conditions.push(lte(tender.estimatedValue, filter.maxPrice));
    }

    // Use query API to get user relation for everyone, bids only for admin
    const tenders = await db.query.tender.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(tender.createdAt)],
      with: { user: true, ...(isAdmin ? { bids: true } : {}) },
    });

    return tenders;
  }

  async findOne(id: number) {
    return await db.query.tender.findFirst({
      where: { id },
      with: { bids: true, user: true },
    });
  }

  async update(id: number, updateTenderDto: UpdateTenderDto, user: JwtPayload) {
    const existing = await db.query.tender.findFirst({ where: { id } });
    if (!existing) throw new NotFoundException(`Tender ${id} not found`);
    if (existing.createdBy !== user.uid) {
      throw new ForbiddenException('You can only update your own tenders');
    }
    const [updated] = await db
      .update(tender)
      .set(updateTenderDto)
      .where(eq(tender.id, id))
      .returning()
      .execute();
    return updated;
  }

  async remove(id: number, user: JwtPayload) {
    const existing = await db.query.tender.findFirst({ where: { id } });
    if (!existing) throw new NotFoundException(`Tender ${id} not found`);
    if (existing.createdBy !== user.uid) {
      throw new ForbiddenException('You can only delete your own tenders');
    }
    const [deleted] = await db
      .delete(tender)
      .where(eq(tender.id, id))
      .returning()
      .execute();
    return { deleted, success: true, message: 'Tender deleted successfully' };
  }
}
