import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ExpressContext } from '@huebot-api/types/context.interface';

@Injectable()
export class AuthRouteGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx =
      GqlExecutionContext.create(context).getContext<ExpressContext>();

    if (ctx.auth) {
      return true;
    }

    return false;
  }
}
