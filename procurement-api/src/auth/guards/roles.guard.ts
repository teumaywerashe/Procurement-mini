import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../decorators/current-user.decorator';
import { UserRole } from '../../user/enum/userRole..enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'User information is missing in the request context',
      );
    }

    const roleMatches = this.matchRoles(requiredRoles, user.role);
    if (!roleMatches) {
      throw new ForbiddenException(
        'you do not have permission to access this resource',
      );
    }
    return true;
  }

  private matchRoles(requiredRoles: UserRole[], userRole: UserRole): boolean {
    return requiredRoles.includes(userRole);
  }
}
