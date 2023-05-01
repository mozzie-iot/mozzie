import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import {
  ConfigService,
  RedisModule,
  RedisService,
} from '@huebot-hub-core/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RedisStore = require('connect-redis').default;

@Module({
  imports: [RedisModule],
})
export class SessionModule implements NestModule {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          store: new RedisStore({
            client: this.redisService.client as any,
          }),
          saveUninitialized: false,
          name: this.configService.SESSION_NAME,
          secret: this.configService.SESSION_SECRET,
          resave: false,
          rolling: true,
          cookie: {
            httpOnly: true,
            maxAge: this.configService.SESSION_MAX_AGE,
            secure: this.configService.NODE_ENV === 'production',
          },
        }),
        cookieParser(),
      )
      .forRoutes('*');
  }
}
