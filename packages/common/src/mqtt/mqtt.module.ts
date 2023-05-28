import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigModule, ConfigService } from '../config';

import { MQTT_CLIENT } from './mqtt.constants';

const mqttProvider = {
  provide: MQTT_CLIENT,
  useFactory: (configService: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: {
        url: `mqtt:${configService.MQTT_HOST}:${configService.MQTT_PORT}`,
        username: configService.MQTT_USERNAME,
        password: configService.MQTT_PASSWORD,
      },
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [mqttProvider],
  exports: [mqttProvider],
})
export class MqttModule {}
