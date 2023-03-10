import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import {
  configParseHuebot,
  configParseMqtt,
  ConfigService,
} from '@huebot-hub-core/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('API');

  try {
    const huebot_config = configParseHuebot();
    const mqtt_config = configParseMqtt();

    const app = await NestFactory.create(
      AppModule.forRoot({
        api_key: huebot_config.api_key,
        secret_key: huebot_config.secret_key,
        mqtt_username: mqtt_config.mqtt_username,
        mqtt_password: mqtt_config.mqtt_password,
      }),
    );

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    const configService = app.get(ConfigService);

    await app.listen(configService.API_PORT);

    logger.log('API started successfully');
  } catch (error) {
    logger.error('API failed to start', error);
  }
}

bootstrap();
