import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';

import { ConfigService } from '@huebot-hub-core/common';
import { AuthRouteService } from '@huebot-ping/routes/auth/auth.service';
import { ExpressContext } from '@huebot-ping/types/context.interface';

@Injectable()
export class GqlService implements GqlOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthRouteService
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      path: '/ping',
      debug: this.configService.NODE_ENV !== 'production',
      cache:
        this.configService.NODE_ENV === 'production' ? 'bounded' : undefined,
      autoSchemaFile: 'schema.gql',
      definitions: {
        outputAs: 'class',
      },
      playground: this.configService.NODE_ENV !== 'production',
      context: async (ctx: ExpressContext) => {
        return {
          ...ctx,
          auth: await this.authService.validate(ctx.req),
        };
      },
    };
  }
}
