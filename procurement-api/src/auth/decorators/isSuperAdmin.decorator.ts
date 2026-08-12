import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { IsSuperAdminGuard } from '../guards/isSuperAdmin.guard';

export const IS_SUPER_ADMIN_KEY = 'isSuperAdminOnly';

/**
 * Decorator that restricts endpoint access strictly to SuperAdmin users.
 * Automatically applies IsSuperAdminGuard to verify the requesting user's role.
 */
export const IsSuperAdmin = () =>
  applyDecorators(
    SetMetadata(IS_SUPER_ADMIN_KEY, true),
    UseGuards(IsSuperAdminGuard),
  );

export const SuperAdminOnly = IsSuperAdmin;
