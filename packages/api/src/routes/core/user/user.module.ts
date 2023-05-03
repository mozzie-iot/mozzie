import { Module } from '@nestjs/common';

import { AuthModule } from '@huebot-api/auth/auth.module';
import { UserEntityModule } from '@huebot-hub-core/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [UserEntityModule, AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
