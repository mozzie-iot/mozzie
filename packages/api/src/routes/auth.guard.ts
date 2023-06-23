import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { RoleEnum } from '@huebot/role/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<RoleEnum>('role', context.getHandler());

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

    if (user.is_admin) {
      return true;
    }

    const user_role = user.role;

    try {
      return user_role[role];
    } catch (error) {
      console.warn(error);
      return false;
    }
  }
}
