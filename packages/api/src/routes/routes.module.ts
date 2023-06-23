import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ApiKeyEntityModule, UserEntityModule } from '@huebot/common';

import { ApiKeyModule } from './api-key/api-key.module';
import { AuthMiddleware } from './auth.middleware';
import { NodeModule } from './node/node.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserEntityModule,
    ApiKeyEntityModule,
    UserModule,
    ApiKeyModule,
    RoleModule,
    NodeModule,
  ],
})
export class RoutesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
