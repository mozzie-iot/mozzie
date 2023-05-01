import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from '@huebot-api/middlewares/auth.middleware';
import { UserEntityModule } from '@huebot-hub-core/common';

import { NodeModule } from './node/node.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserEntityModule, UserModule, NodeModule],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
