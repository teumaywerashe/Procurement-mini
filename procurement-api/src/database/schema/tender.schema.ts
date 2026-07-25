import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { user } from './user.shema';
import { relations } from 'drizzle-orm/_relations';
export const tender = pgTable('tender', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  status: varchar('status', { length: 255 }).notNull().default('Draft'),
  title: varchar('title', { length: 255 }).notNull(),
  closingDate: timestamp('closing_date').notNull(),
  estimatedValue: varchar('estimated_value', { length: 255 }).notNull(),
  createdBy: varchar('created_by', { length: 255 })
    .notNull()
    .references((): any => user.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tenderRelations = relations(tender, ({ one }) => ({
  user: one(user, { fields: [tender.createdBy], references: [user.id] }),
}));
