import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './user.schema';

export const vendor = pgTable('vendor', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  ownerId: integer('owner_id').references(() => users.id),
  registrationNumber: varchar('registration_number', { length: 255 })
    .notNull()
    .unique(),
  phoneNumber: varchar('phone_number', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
