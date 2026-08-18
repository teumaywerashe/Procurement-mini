import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const notification = pgTable('notification', {
  id: serial('id').primaryKey().notNull(),
  type: varchar('type').notNull(),
  isRead: boolean('isRead').default(false).notNull(),
  message: varchar('message').notNull(),
  userId: integer('userId').notNull(),
  tenderId: integer('tenderId'),
  bidId: integer('bidId'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
