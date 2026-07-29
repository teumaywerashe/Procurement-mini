// common/guards/admin-or-owner.guard.ts

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from '../decorators/current-user.decorator';
import { UserRole } from '../../user/enum/userRole..enum';
// import { UserRole } from '../enum/userRole..enum';

@Injectable()
export class AdminOrOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const enabled = this.reflector.get<boolean>(
      'adminOrOwner',
      context.getHandler(),
    );

    if (!enabled) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();

    const user = request.user; // Comes from JwtAuthGuard
    const userId = request.params.id;

    // Admin can do everything
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Owner can access their own resource
    if (String(user.uid) === userId) {
      return true;
    }

    throw new ForbiddenException('You are not allowed to perform this action.');
  }
}
