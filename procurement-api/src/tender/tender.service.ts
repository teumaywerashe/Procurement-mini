/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { eq, and, desc, asc, ilike, lte, gte, SQL, count } from 'drizzle-orm';
import { TenderFilterDto } from './dto/tender-filter.dto';
import { UserRole } from '../user/enum/userRole.enum';
import type { CollectionResult } from '../common/dto/collection-result';

function isAdminLike(user?: JwtPayload) {
  return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
}

@Injectable()
export class TenderService {
  async create(createTenderDto: CreateTenderDto, user: JwtPayload) {
    const [newTender] = await db
      .insert(tender)
      .values({
        ...createTenderDto,
        createdBy: user.uid,
        referenceNumber: `Tender-${new Date().getTime()}-${user.uid}`,
      })
      .returning()
      .execute();
    return newTender;
  }

  async findAll(user: JwtPayload) {
    const adminLike = isAdminLike(user);

    // ADMIN scoped to their own tenders; SUPER_ADMIN and VENDOR see all
    const whereClause =
      user.role === UserRole.ADMIN ? eq(tender.createdBy, user.uid) : undefined;

    const rows = await db
      .select()
      .from(tender)
      .where(whereClause)
      .orderBy(desc(tender.createdAt));

    const ids = rows.map((r) => r.id);
    if (ids.length === 0) return [];

    const withRelations = await db.query.tender.findMany({
      where: { id: { in: ids } },
      // Admins get bids included; vendors/public get tenders only
      with: { user: true, ...(adminLike ? { bids: true } : {}) },
    });
    return ids.map((id) => withRelations.find((t) => t.id === id)!);
  }

  async findAllByFilter(
    filter: TenderFilterDto,
    user: JwtPayload,
  ): Promise<CollectionResult<any>> {
    const adminLike = isAdminLike(user);
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    // ADMIN scoped to their own; SUPER_ADMIN sees all
    if (user.role === UserRole.ADMIN) {
      conditions.push(eq(tender.createdBy, user.uid));
    }

    const searchTerm = filter.q ?? filter.title;
    if (searchTerm) conditions.push(ilike(tender.title, `%${searchTerm}%`));
    if (filter.minPrice !== undefined)
      conditions.push(gte(tender.estimatedValue, filter.minPrice));
    if (filter.maxPrice !== undefined)
      conditions.push(lte(tender.estimatedValue, filter.maxPrice));

    const where = conditions.length ? and(...conditions) : undefined;

    const SORTABLE: Record<string, any> = {
      createdAt: tender.createdAt,
      title: tender.title,
      estimatedValue: tender.estimatedValue,
      closingDate: tender.closingDate,
    };
    const sortCol = SORTABLE[filter.sortBy ?? 'createdAt'] ?? tender.createdAt;
    const orderFn = (filter.sortDir ?? 'desc') === 'asc' ? asc : desc;

    const [{ value: total }] = await db
      .select({ value: count() })
      .from(tender)
      .where(where);

    const rows = await db
      .select()
      .from(tender)
      .where(where)
      .orderBy(orderFn(sortCol))
      .limit(limit)
      .offset(offset);

    const ids = rows.map((r) => r.id);
    if (ids.length === 0)
      return { data: [], total: Number(total), page, limit };

    const withRelations = await db.query.tender.findMany({
      where: { id: { in: ids } },
      // Admins (ADMIN + SUPER_ADMIN) get bids; vendors/public get tenders only
      with: { user: true, ...(adminLike ? { bids: true } : {}) },
    });
    const data = ids.map((id) => withRelations.find((t) => t.id === id)!);

    return { data, total: Number(total), page, limit };
  }

  async findOne(id: number, user?: JwtPayload) {
    const existing = await db.query.tender.findFirst({ where: { id } });
    if (!existing) return null;

    const canSeeBids =
      user?.role === UserRole.SUPER_ADMIN ||
      (user?.role === UserRole.ADMIN && existing.createdBy === user?.uid);

    return await db.query.tender.findFirst({
      where: { id },
      with: { user: true, ...(canSeeBids ? { bids: true } : {}) },
    });
  }

  async update(id: number, updateTenderDto: UpdateTenderDto, user: JwtPayload) {
    const existing = await db.query.tender.findFirst({ where: { id } });
    if (!existing) throw new NotFoundException(`Tender ${id} not found`);
    if (user.role !== UserRole.SUPER_ADMIN && existing.createdBy !== user.uid) {
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
    if (user.role !== UserRole.SUPER_ADMIN && existing.createdBy !== user.uid) {
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
