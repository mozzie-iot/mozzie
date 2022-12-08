import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigEntity } from './config.entity';
import { ConfigEntityService } from './config.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigEntity])],
  providers: [ConfigEntityService],
  exports: [ConfigEntityService],
})
export class ConfigEntityModule {}
