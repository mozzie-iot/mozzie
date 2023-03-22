import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AuthRouteModule } from '@huebot-utility/routes/auth/auth.module';

import { GqlService } from './graphql.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlService,
      imports: [AuthRouteModule],
    }),
  ],
})
export class GqlModule {}
