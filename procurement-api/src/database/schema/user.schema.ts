import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { UserRole } from '../../user/enum/userRole.enum';
// import { UserRole } from '../../user/enum/userRole.enum';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 255 }).notNull().default(UserRole.VENDOR),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
