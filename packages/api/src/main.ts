import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@huebot/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('API');

  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      credentials: true,
    });

    const configService = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe());

    app.enableVersioning();

    await app.listen(configService.API_PORT);

    logger.log('API started successfully!');
  } catch (error) {
    logger.error('API failed to start', error);
  }
}

bootstrap();
