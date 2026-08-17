import { string } from 'drizzle-orm/cockroach-core';
import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';

export const notification = pgTable('notification', {
  id: serial('id').primaryKey().notNull(),
  type: string('type').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  message: string('message').notNull(),
  userId: integer('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
