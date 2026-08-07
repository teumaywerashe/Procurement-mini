import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core/services/reflector.service';
import { JwtPayload } from '../decorators/types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();
    const token = this.extractToken(request);

    if (token) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
        request.user = payload;
      } catch {
        if (!isPublic) {
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
    } else if (!isPublic) {
      throw new UnauthorizedException('Missing auth token');
    }

    return true;
  }

  private extractToken(request: Request): string | null {
    const cookieToken = (request.cookies as Record<string, string>)
      ?.access_token;
    if (cookieToken) return cookieToken;

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
