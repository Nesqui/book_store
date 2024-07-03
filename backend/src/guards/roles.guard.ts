import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

export enum Role {
  USER = 1 << 0,      // 0001
  ADMIN = 1 << 1,     // 0010
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRoles = user.role;

    const hasRole = requiredRoles.some((role) => (userRoles & role) === role);

    if (!hasRole) {
      throw new ForbiddenException('Role restriction');
    }

    return hasRole;
  }
}