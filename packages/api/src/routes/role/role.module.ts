import { Module } from '@nestjs/common';

import { RoleEntityModule } from '@huebot/common';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [RoleEntityModule],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
