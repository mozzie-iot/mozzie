import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ExpressContext } from '@huebot-ping/types/context.interface';

import { AuthRouteDto } from './auth.dto';

export const AuthRoute = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthRouteDto | undefined => {
    const context =
      GqlExecutionContext.create(ctx).getContext<ExpressContext>();
    return context.auth;
  }
);
