import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesContext = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesContext) {
      return true;
    }
    const ctx = context.switchToHttp();
    const request = ctx.getRequest() as Request;
    const user = request.user as User;

    if (!rolesContext.includes(user.role))
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );

    return true;
  }
}
