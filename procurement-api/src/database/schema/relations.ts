import { relations } from 'drizzle-orm/_relations';
import { vendor } from './vendor.schema';
import { bid } from './bid.schema';
import { users } from './user.schema';
import { tender } from './tender.schema';

export const bidWithVendorRelation = relations(bid, ({ one }) => ({
  vendor: one(vendor, { fields: [bid.vendorId], references: [vendor.id] }),
  tender: one(tender, { fields: [bid.tenderId], references: [tender.id] }),
}));

export const tenderRelations = relations(tender, ({ one }) => ({
  user: one(users, { fields: [tender.createdBy], references: [users.id] }),
}));

export const userRelations = relations(users, ({ one }) => ({
  vendor: one(vendor, { fields: [users.id], references: [vendor.ownerId] }),
}));

export const vendorRelations = relations(vendor, ({ many, one }) => ({
  bids: many(bid),
  user: one(users, { fields: [vendor.ownerId], references: [users.id] }),
}));
