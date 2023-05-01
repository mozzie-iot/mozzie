import { Module } from '@nestjs/common';

import { UserEntityModule } from '@huebot-hub-core/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserEntityModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
