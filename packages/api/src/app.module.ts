import { Module } from '@nestjs/common';

import { ConfigModule, TypeOrmModule } from '@huebot-hub-core/common';

import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [ConfigModule, TypeOrmModule, RoutesModule],
})
export class AppModule {}
