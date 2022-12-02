import { Module } from '@nestjs/common';

import { ConfigModule, RedisModule } from '@huebot-hub-core/common';

import { GqlModule } from './graphql/graphql.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [ConfigModule, RedisModule, GqlModule, RoutesModule],
})
export class AppModule {}
