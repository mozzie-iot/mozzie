import {
  RedisModule as NestjsRedisModule,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';

import { ConfigService } from '@huebot-common/config';

import { RedisService } from './redis.service';

@Module({
  imports: [
    NestjsRedisModule.forRootAsync({
      useFactory: (config: ConfigService): RedisModuleOptions => ({
        config: {
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
          password: config.REDIS_PASSWORD,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
