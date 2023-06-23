import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common';
import RedisStore from 'connect-redis';
import session from 'express-session';

import {
  ConfigService,
  REDIS_CLIENT,
  Redis,
  RedisModule,
} from '@huebot/common';

@Module({
  imports: [RedisModule],
})
export class SessionModule implements NestModule {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const redisStore = new RedisStore({
      client: this.redisClient,
      prefix: 'sess:',
    });

    consumer
      .apply(
        session({
          store: redisStore,
          saveUninitialized: false,
          name: this.configService.SESSION_NAME,
          secret: this.configService.SESSION_SECRET,
          resave: false,
          cookie: {
            httpOnly: true,
            maxAge: this.configService.SESSION_MAX_AGE,
            secure: false,
            // Uncomment once SSL is set up
            // secure: this.configService.NODE_ENV === 'production',
          },
        }),
      )
      .forRoutes('*');
  }
}
