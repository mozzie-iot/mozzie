import { Module } from '@nestjs/common';

import {
  ConfigModule,
  RedisModule,
  TypeOrmModule,
} from '@huebot-hub-core/common';

import { GqlModule } from './graphql/graphql.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [ConfigModule, TypeOrmModule, GqlModule, RoutesModule],
})
export class AppModule {}
