import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { vendor } from './vendor.schema';
import { relations } from 'drizzle-orm/_relations';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 255 }).notNull().default('Vendor'),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userRelations = relations(users, ({ one }) => ({
  vendor: one(vendor, { fields: [users.id], references: [vendor.ownerId] }),
}));
