import { DynamicModule, Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigModuleArgs,
  RedisModule,
  TypeOrmModule,
} from '@huebot-hub-core/common';

import { RoutesModule } from './routes/routes.module';
import { SessionModule } from './session/session.module';

@Module({})
export class AppModule {
  static forRoot(config_args: ConfigModuleArgs): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(config_args),
        SessionModule,
        TypeOrmModule,
        RedisModule,
        RoutesModule,
      ],
    };
  }
}
