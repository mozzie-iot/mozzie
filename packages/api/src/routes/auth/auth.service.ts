import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

import {
  ConfigEntityService,
  InstanceRoleEnum,
  UserEntityService,
} from '@huebot-hub-core/common';

import { AuthRouteDto } from './auth.dto';

interface TokenPayload {
  user_id: string;
  role: InstanceRoleEnum;
}

@Injectable()
export class AuthRouteService {
  private readonly logger = new Logger(AuthRouteService.name);

  constructor(
    private readonly configEntityService: ConfigEntityService,
    private readonly userService: UserEntityService,
  ) {}

  async validate(req: Request): Promise<AuthRouteDto | null> {
    this.logger.debug('Enter validate');

    const authHeader = req.header('authorization');

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return null;
    }

    const secret = await this.configEntityService.repo.findOne({
      where: { name: 'instance_secret' },
    });

    if (!secret) {
      return null;
    }

    try {
      const { user_id, role } = jwt.verify(token, secret.value) as TokenPayload;

      const user = await this.userService.repo.findOne({ where: { user_id } });

      if (!user) {
        return null;
      }

      this.logger.debug(`Authorized user: ${user.id} with role: ${role}`);

      return { user, role };
    } catch (error) {
      // console.log(error);
      this.logger.warn('Invalid hub instance token');
      return null;
    } finally {
      this.logger.debug('Exit validate');
    }
  }
}
