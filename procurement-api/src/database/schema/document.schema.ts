import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { tender } from './tender.schema';
import { bid } from './bid.schema';
import { users } from './user.schema';

export const document = pgTable('document', {
  id: serial('id').primaryKey(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  objectKey: varchar('object_key', { length: 512 }).notNull().unique(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  tenderId: integer('tender_id').references(() => tender.id, {
    onDelete: 'cascade',
  }),
  bidId: integer('bid_id').references(() => bid.id, { onDelete: 'cascade' }),
  uploadedBy: integer('uploaded_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
