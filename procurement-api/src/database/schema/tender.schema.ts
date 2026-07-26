import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { relations } from 'drizzle-orm/_relations';
import { tenderStatus } from '../../tender/enum/tenderStatus.enum';
export const tender = pgTable('tender', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  status: varchar('status', { length: 255 }).default(tenderStatus.DRAFT),
  title: varchar('title', { length: 255 }).notNull(),
  closingDate: timestamp('closing_date').notNull(),
  estimatedValue: decimal('estimated_value', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  createdBy: integer('created_by')
    .notNull()
    .references((): any => users.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tenderRelations = relations(tender, ({ one }) => ({
  user: one(users, { fields: [tender.createdBy], references: [users.id] }),
}));
