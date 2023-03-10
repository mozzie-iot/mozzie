import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { configParseMqtt, ConfigService } from '@huebot-hub-core/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main:bootstrap');

  try {
    const mqtt_config = configParseMqtt();

    const app = await NestFactory.create(
      AppModule.forRoot({
        api_key: undefined,
        secret_key: undefined,
        mqtt_username: mqtt_config.mqtt_username,
        mqtt_password: mqtt_config.mqtt_password,
      }),
      {
        logger,
      },
    );

    const configService: ConfigService = app.get(ConfigService);

    app.connectMicroservice({
      transport: Transport.MQTT,
      options: {
        url: `mqtt:${configService.MQTT_HOST}:${configService.MQTT_PORT}`,
        username: configService.MQTT_USERNAME,
        password: configService.MQTT_PASSWORD,
      },
    });

    await app.startAllMicroservices();

    logger.log('Controller started successfully');
  } catch (error) {
    logger.error('Controller failed to start');
  }
}
bootstrap();
