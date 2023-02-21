import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { MqttCredentials } from '../interfaces';

import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(mqtt_credentials?: MqttCredentials): DynamicModule {
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
                MQTT_USERNAME: mqtt_credentials
                  ? mqtt_credentials.mqtt_username
                  : undefined,
                MQTT_PASSWORD: mqtt_credentials
                  ? mqtt_credentials.mqtt_password
                  : undefined,
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
