import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { relations } from 'drizzle-orm/_relations';
export const tender = pgTable('tender', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  status: varchar('status', { length: 255 }).notNull().default('Draft'),
  title: varchar('title', { length: 255 }).notNull(),
  closingDate: timestamp('closing_date').notNull(),
  estimatedValue: varchar('estimated_value', { length: 255 }).notNull(),
  createdBy: integer('created_by')
    .notNull()
    .references((): any => users.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tenderRelations = relations(tender, ({ one }) => ({
  user: one(users, { fields: [tender.createdBy], references: [users.id] }),
}));
