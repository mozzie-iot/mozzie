import { Logger, Module } from '@nestjs/common';
import IORedis from 'ioredis';

import { ConfigModule, ConfigService } from '../config';

import { REDIS_CLIENT } from './redis.constants';

const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    const client = new IORedis({
      host: configService.REDIS_HOST,
      port: configService.REDIS_PORT,
      password: configService.REDIS_PASSWORD,
    });

    logger.log('Redis client ready');

    client.on('error', (err) => {
      logger.error('Redis Client Error: ', err);
    });

    client.on('connect', () => {
      logger.log(
        `Connected to redis on ${client.options.host}:${client.options.port}`
      );
    });

    return client;
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
