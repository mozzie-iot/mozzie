import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './role.entity';
import { RoleEntityService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleEntityService],
  exports: [RoleEntityService],
})
export class RoleEntityModule {}
