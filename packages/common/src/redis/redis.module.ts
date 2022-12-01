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
      useFactory: (config: ConfigService): RedisModuleOptions => {
        return {
          config: {
            url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}/0`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
