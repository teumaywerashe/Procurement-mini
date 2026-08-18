import { Injectable } from '@nestjs/common';
import { CreateNotifiactionDto } from './dto/create-notifiaction.dto';
import { UpdateNotifiactionDto } from './dto/update-notifiaction.dto';
import { db } from '../database/db';
import { desc, eq } from 'drizzle-orm';
import { notification } from '../database/schema/notification.schema';
@Injectable()
export class NotifiactionService {
  async create(createNotifiactionDto: CreateNotifiactionDto, userId: number) {
    const values: typeof notification.$inferInsert = {
      type: createNotifiactionDto.type ?? 'BID',
      message: createNotifiactionDto.message ?? '',
      userId,
    };

    const [newNotification] = await db
      .insert(notification)
      .values(values)
      .returning();
    return newNotification;
  }

  async findAll() {
    return await db
      .select()
      .from(notification)
      .orderBy(desc(notification.createdAt));
  }

  async findOne(id: number) {
    return await db
      .select()
      .from(notification)
      .where(eq(notification.id, id))
      .execute();
  }

  async update(id: number, updateNotifiactionDto: UpdateNotifiactionDto) {
    const [updatedNotification] = await db
      .update(notification)
      .set(updateNotifiactionDto)
      .where(eq(notification.id, id))
      .returning();
    return updatedNotification;
  }

  async remove(id: number) {
    const [deletedNotification] = await db
      .delete(notification)
      .where(eq(notification.id, id))
      .returning();
    return deletedNotification;
  }
}
