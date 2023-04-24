import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ROLES } from '@huebot-api/roles/roles.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('role', context.getHandler());
    if (!role) {
      throw new HttpException(
        'Must include Roles decorator when using RolesGuard',
        HttpStatus.BAD_REQUEST,
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      return false;
    }

    const role_index = ROLES.indexOf(role);

    if (role_index < 0) {
      throw new HttpException(
        `Endpoint has unsupported role: ${role}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user_role_index = ROLES.indexOf(user.role);

    if (user_role_index < 0) {
      throw new HttpException(
        `User has unsupported role: ${user.role}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user_role_index >= role_index;
  }
}
