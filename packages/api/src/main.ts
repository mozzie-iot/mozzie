import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@huebot-hub-core/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  console.log('ENV: ', configService.NODE_ENV);

  await app.listen(configService.API_PORT);
}
bootstrap();
