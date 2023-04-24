import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserEntityService } from '@huebot-hub-core/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserEntityService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const { userId } = req.session;

    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await this.userService.repo.findOne({ where: { id: userId } });
    req.user = user;
    next();
  }
}
