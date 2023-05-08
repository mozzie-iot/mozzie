import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [
        () => ({
          API_PORT: 3000,
          REDIS_HOST: 'redis',
          REDIS_PORT: 6379,
          MQTT_HOST: 'mqtt_broker',
          MQTT_PORT: 1883,
        }),
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
