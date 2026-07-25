import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { bid } from './bid.schema';
import { relations } from 'drizzle-orm/_relations';
import { users } from './user.schema';

export const vendor = pgTable('vendor', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  registrationNumber: varchar('registration_number', { length: 255 })
    .notNull()
    .unique(),
  phoneNumber: varchar('phone_number', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const vendorRelations = relations(vendor, ({ many, one }) => ({
  bids: many(bid),
  user: one(users, { fields: [vendor.id], references: [users.vendorId] }),
}));
