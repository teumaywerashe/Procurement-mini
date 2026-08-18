import { defineRelations } from 'drizzle-orm/relations';
import { vendor } from './vendor.schema';
import { bid } from './bid.schema';
import { users } from './user.schema';
import { tender } from './tender.schema';
import { document } from './document.schema';
import { notification } from './notification.schema';

export const relations = defineRelations(
  { vendor, bid, users, tender, document, notification },
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
      documents: helpers.many.document({
        from: helpers.bid.id,
        to: helpers.document.bidId,
      }),
      notifications: helpers.many.notification({
        from: helpers.bid.id,
        to: helpers.notification.bidId,
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
      documents: helpers.many.document({
        from: helpers.tender.id,
        to: helpers.document.tenderId,
      }),
      notifications: helpers.many.notification({
        from: helpers.tender.id,
        to: helpers.notification.tenderId,
      }),
    },
    users: {
      vendor: helpers.one.vendor({
        from: helpers.users.id,
        to: helpers.vendor.ownerId,
      }),
      documents: helpers.many.document({
        from: helpers.users.id,
        to: helpers.document.uploadedBy,
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
    document: {
      tender: helpers.one.tender({
        from: helpers.document.tenderId,
        to: helpers.tender.id,
      }),
      bid: helpers.one.bid({
        from: helpers.document.bidId,
        to: helpers.bid.id,
      }),
      uploader: helpers.one.users({
        from: helpers.document.uploadedBy,
        to: helpers.users.id,
      }),
    },
    notification: {
      bid: helpers.one.bid({
        from: helpers.notification.bidId,
        to: helpers.bid.id,
      }),
      tender: helpers.one.tender({
        from: helpers.notification.tenderId,
        to: helpers.tender.id,
      }),
    },
  }),
);
