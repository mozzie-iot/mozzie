import { Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrmCoreModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ConfigModule } from '../config/config.module';

import { TypeormService } from './typeorm.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmCoreModule.forRootAsync({
      useClass: TypeormService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
})
export class TypeOrmModule {}
