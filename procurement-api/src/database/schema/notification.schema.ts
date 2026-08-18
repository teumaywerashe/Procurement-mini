import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { bid } from './bid.schema';
import { tender } from './tender.schema';

export const notification = pgTable('notification', {
  id: serial('id').primaryKey().notNull(),
  type: varchar('type').notNull(),
  isRead: boolean('isRead').default(false).notNull(),
  message: varchar('message').notNull(),
  userId: integer('userId').notNull(),
  tenderId: integer('tenderId').references(() => tender.id, {
    onDelete: 'cascade',
  }),
  bidId: integer('bidId').references(() => bid.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});
