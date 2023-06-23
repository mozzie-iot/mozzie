import { Module } from '@nestjs/common';

import { ConfigModule, TypeOrmModule } from '@huebot/common';

import { RoutesModule } from './routes/routes.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [ConfigModule, SessionModule, TypeOrmModule, RoutesModule],
})
export class AppModule {}
