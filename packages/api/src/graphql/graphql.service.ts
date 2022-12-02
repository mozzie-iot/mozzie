import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';

import { ExpressContext } from '@huebot-api/types/context.interface';
import { ConfigService } from '@huebot-hub-core/common';

@Injectable()
export class GqlService implements GqlOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      path: '/core',
      debug: this.configService.NODE_ENV !== 'production',
      cache:
        this.configService.NODE_ENV === 'production' ? 'bounded' : undefined,
      autoSchemaFile: 'schema.gql',
      definitions: {
        outputAs: 'class',
      },
      playground: this.configService.NODE_ENV !== 'production',
      context: async (ctx: ExpressContext) => {
        return ctx;
      },
    };
  }
}
