import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { vendor } from './vendor.schema';
import { tender } from './tender.schema';
import { relations } from 'drizzle-orm/_relations';

export const bid = pgTable('bid', {
  id: serial('id').primaryKey(),
  vendorId: integer('vendor_id')
    .notNull()
    .references(() => vendor.id),
  amount: integer('amount').notNull(),
  tenderId: integer('tender_id')
    .notNull()
    .references(() => tender.id),
  referenceNumber: integer('reference_number').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

export const bidWithVendorRelation = relations(bid, ({ one }) => ({
  vendor: one(vendor, { fields: [bid.vendorId], references: [vendor.id] }),
  tender: one(tender, { fields: [bid.tenderId], references: [tender.id] }),
}));
