import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from '../decorators/types';
import { UserRole } from '../../user/enum/userRole.enum';
import { IS_SUPER_ADMIN_KEY } from '../decorators/isSuperAdmin.decorator';

@Injectable()
export class IsSuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isSuperAdminRequired = this.reflector.getAllAndOverride<boolean>(
      IS_SUPER_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isSuperAdminRequired) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'User authentication information is missing in request context.',
      );
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Access denied: Only SuperAdmin is authorized to update user roles.',
      );
    }

    return true;
  }
}
