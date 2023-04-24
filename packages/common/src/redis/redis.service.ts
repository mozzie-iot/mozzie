import { RedisService as NestjsRedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly client: Redis;

  constructor(private readonly redisService: NestjsRedisService) {
    this.client = this.redisService.getClient();
  }
}
