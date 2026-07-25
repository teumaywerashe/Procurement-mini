import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { vendor } from './vendor.schema';
import { relations } from 'drizzle-orm/_relations';

export const user = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  role: varchar('role', { length: 255 }).notNull().default('Vendor'),
  password: varchar('password', { length: 255 }).notNull(),
  vendorId: integer('vendor_id').references(() => vendor.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userRelations = relations(user, ({ one }) => ({
  vendor: one(vendor, { fields: [user.vendorId], references: [vendor.id] }),
}));
