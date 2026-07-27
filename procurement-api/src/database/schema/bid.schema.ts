import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { vendor } from './vendor.schema';
import { tender } from './tender.schema';

export const bid = pgTable('bid', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id')
    .notNull()
    .references(() => vendor.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  tenderId: integer('tender_id')
    .notNull()
    .references(() => tender.id, { onDelete: 'cascade' }),
  referenceNumber: integer('reference_number').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});
