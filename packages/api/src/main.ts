import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@huebot-hub-core/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const configService = app.get(ConfigService);

  await app.listen(configService.API_PORT);
}
bootstrap();
