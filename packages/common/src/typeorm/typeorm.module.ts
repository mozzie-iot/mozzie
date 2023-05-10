import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrmCoreModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';

import { TypeormService } from './typeorm.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmCoreModule.forRootAsync({
      useClass: TypeormService,
    }),
  ],
})
export class TypeOrmModule {}
