import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigModuleArgs } from '@huebot-hub-core/common';

import { NodeModule } from './node/node.module';

@Module({})
export class AppModule {
  static forRoot(config_args: ConfigModuleArgs): DynamicModule {
    return {
      module: AppModule,
      imports: [ConfigModule.forRoot(config_args), NodeModule],
    };
  }
}
