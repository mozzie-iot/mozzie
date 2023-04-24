import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrmCoreModule } from '@nestjs/typeorm';

import { ConfigService } from '@huebot-common/config';

import { ConfigModule } from '../config/config.module';

import { DataSource } from './datasource';
import { typeormConfig } from './typeorm.config';
import { TypeormService } from './typeorm.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmCoreModule.forRootAsync({
      useClass: TypeormService,
    }),
  ],
  providers: [
    {
      provide: DataSource,
      useFactory: async (configService: ConfigService) => {
        const dataSource = await new DataSource(
          typeormConfig(configService.NODE_ENV, true)
        ).initialize();
        return dataSource;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DataSource],
})
export class TypeOrmModule {}
