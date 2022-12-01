import { Injectable } from '@nestjs/common';

import { RedisService } from '@huebot-hub-core/common';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}
  getHello(): string {
    this.redisService.set('TEMP KEY', 'TEMP VALUE');
    return 'Hello World!';
  }
}
