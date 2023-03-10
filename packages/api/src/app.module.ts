import { DynamicModule, Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigModuleArgs,
  RedisModule,
  TypeOrmModule,
} from '@huebot-hub-core/common';

import { GqlModule } from './graphql/graphql.module';
import { RoutesModule } from './routes/routes.module';

@Module({})
export class AppModule {
  static forRoot(config_args: ConfigModuleArgs): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(config_args),
        TypeOrmModule,
        RedisModule,
        GqlModule,
        RoutesModule,
      ],
    };
  }
}
