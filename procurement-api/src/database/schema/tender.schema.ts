import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';
import { tenderStatus } from '../../tender/enum/tenderStatus.enum';
export const tender = pgTable('tender', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  status: varchar('status', { length: 255 }).default(tenderStatus.DRAFT),
  title: varchar('title', { length: 255 }).notNull(),
  closingDate: timestamp('closing_date').notNull(),
  referenceNumber: varchar('reference_number', { length: 255 }).notNull(),
  estimatedValue: decimal('estimated_value', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
  createdBy: integer('created_by')
    .notNull()
    .references((): any => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
