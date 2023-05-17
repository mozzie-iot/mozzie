import { Module } from '@nestjs/common';

import { UserEntityModule } from '@huebot/common';

import { AdminUserModule } from './user/user.module';

@Module({
  imports: [UserEntityModule, AdminUserModule],
})
export class AdminModule {}
