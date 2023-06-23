import { Module } from '@nestjs/common';

import { RoleEntityModule, UserEntityModule } from '@huebot/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserEntityModule, RoleEntityModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
