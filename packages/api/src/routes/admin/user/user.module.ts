import { Module } from '@nestjs/common';

import { UserEntityModule } from '@huebot/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserEntityModule],
  providers: [UserService],
  controllers: [UserController],
})
export class AdminUserModule {}
