import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/auth.guard';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Authorization(...roles: UserRole[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(JwtGuard, RolesGuard));
  }
  return UseGuards(JwtGuard);
}
