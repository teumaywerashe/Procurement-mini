import { defineRelations } from 'drizzle-orm/relations';
import { vendor } from './vendor.schema';
import { bid } from './bid.schema';
import { users } from './user.schema';
import { tender } from './tender.schema';

export const relations = defineRelations(
  { vendor, bid, users, tender },
  (helpers) => ({
    bid: {
      vendor: helpers.one.vendor({
        from: helpers.bid.vendorId,
        to: helpers.vendor.id,
      }),
      tender: helpers.one.tender({
        from: helpers.bid.tenderId,
        to: helpers.tender.id,
      }),
    },
    tender: {
      user: helpers.one.users({
        from: helpers.tender.createdBy,
        to: helpers.users.id,
      }),
      bids: helpers.many.bid({
        from: helpers.tender.id,
        to: helpers.bid.tenderId,
      }),
    },
    users: {
      vendor: helpers.one.vendor({
        from: helpers.users.id,
        to: helpers.vendor.ownerId,
      }),
    },
    vendor: {
      bids: helpers.many.bid({
        from: helpers.vendor.id,
        to: helpers.bid.vendorId,
      }),
      user: helpers.one.users({
        from: helpers.vendor.ownerId,
        to: helpers.users.id,
      }),
    },
  }),
);
