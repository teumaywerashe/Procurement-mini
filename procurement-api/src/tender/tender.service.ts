import { Injectable } from '@nestjs/common';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import { JwtPayload } from '../auth/decorators/current-user.decorator';
import { db } from '../database/db';
import { tender } from '../database/schema/tender.schema';
import { eq } from 'drizzle-orm/sql/expressions/conditions';
import { TenderFilterDto } from './dto/tender-filter.dto';
import { and, ilike, lte } from 'drizzle-orm';

@Injectable()
export class TenderService {
  async create(createTenderDto: CreateTenderDto, user: JwtPayload) {
    const [newTender] = await db
      .insert(tender)
      .values({
        ...createTenderDto,
        createdBy: user.uid,
        referenceNumber: `Tender-${user.uid}`,
      })
      .returning()
      .execute();
    return newTender;
  }

  async findAll() {
    return await db.select().from(tender).execute();
  }
  async findAllByFilter(filter: TenderFilterDto) {
    const conditions: ReturnType<typeof ilike>[] = [];

    if (filter.title) {
      conditions.push(ilike(tender.title, `%${filter.title}%`));
    }

    if (filter.price) {
      conditions.push(lte(tender.estimatedValue, filter.price));
    }

    return await db
      .select()
      .from(tender)
      .where(conditions.length ? and(...conditions) : undefined)
      .execute();
  }
  async findOne(id: number) {
    const [existingTender] = await db
      .select()
      .from(tender)
      .where(eq(tender.id, id))
      .execute();
    return existingTender;
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
    return deletedTender;
  }
}
