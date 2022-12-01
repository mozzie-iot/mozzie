import { Module } from '@nestjs/common';

import { ConfigModule, RedisModule } from '@huebot-hub-core/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
