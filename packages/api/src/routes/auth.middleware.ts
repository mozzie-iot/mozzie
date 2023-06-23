import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { ApiKeyEntityService, UserEntityService } from '@huebot/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserEntityService,
    private readonly apiKeyService: ApiKeyEntityService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.session;

    // Check for user session
    if (user_id) {
      const user = await this.userService.repo.findOne({
        where: { id: user_id },
        relations: ['role'],
      });
      req.user = user;
      return next();
    }

    const api_key = req.headers['x-api-key'] as string;

    if (api_key) {
      const api_key_entity = await this.apiKeyService.repo.findOne({
        where: { key: api_key },
        relations: ['role'],
      });

      req.api_key = api_key_entity;
    }

    next();
  }
}
