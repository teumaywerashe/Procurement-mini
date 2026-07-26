// common/decorators/admin-or-owner.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const ADMIN_OR_OWNER_KEY = 'adminOrOwner';

export const AdminOrOwner = () => SetMetadata(ADMIN_OR_OWNER_KEY, true);
