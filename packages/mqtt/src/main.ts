import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { ConfigService } from '@huebot/common';

import { AppModule } from './app.module';
import { NodeService } from './node/node.service';

async function bootstrap() {
  const logger = new Logger('Main:bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger,
    });

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

    // Ping nodes so those with existing connection reflect as online
    const nodeService: NodeService = app.get(NodeService);
    nodeService.alive_check();

    logger.log('Controller started successfully');
  } catch (error) {
    logger.error('Controller failed to start');
  }
}
bootstrap();
