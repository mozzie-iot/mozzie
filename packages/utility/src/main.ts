import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@huebot-hub-core/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Ping');

  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    const configService = app.get(ConfigService);

    await app.listen(configService.UTILITY_PORT);

    logger.log('Started successfully');
  } catch (error) {
    logger.error('Failed to start', error);
  }
}

bootstrap();
