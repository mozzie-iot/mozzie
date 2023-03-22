import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { ConfigModuleArgs } from './config.interface';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(args?: ConfigModuleArgs): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          load: [
            () => {
              return {
                API_PORT: 3000,
                REDIS_HOST: 'redis',
                REDIS_PORT: 6379,
                NETWORK_NODE_AP_IP: '192.168.101.1',
                MQTT_HOST: 'mqtt_broker',
                MQTT_PORT: 1883,
                NATIVE_HOST: 'native',
                NATIVE_PORT: 9000,
                PING_PORT: 4000,
                API_KEY: args.api_key,
                SECRET_KEY: args.secret_key,
                MQTT_USERNAME: args.mqtt_username,
                MQTT_PASSWORD: args.mqtt_password,
              };
            },
          ],
        }),
      ],
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
