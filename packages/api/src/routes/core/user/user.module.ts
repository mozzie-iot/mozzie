import { AuthModule } from '@huebot-api/auth/auth.module';
import { Module } from '@nestjs/common';

import { UserEntityModule } from '@huebot/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserEntityModule, AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
