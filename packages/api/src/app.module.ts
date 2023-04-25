import { Module } from '@nestjs/common';

import {
  ConfigModule,
  RedisModule,
  TypeOrmModule,
} from '@huebot-hub-core/common';

import { RoutesModule } from './routes/routes.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule,
    SessionModule,
    TypeOrmModule,
    RedisModule,
    RoutesModule,
  ],
})
export class AppModule {}
