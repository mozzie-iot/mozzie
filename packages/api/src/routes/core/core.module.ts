import { Module } from '@nestjs/common';

import { UserEntityModule } from '@huebot/common';

import { NodeModule } from './node/node.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserEntityModule, UserModule, NodeModule],
})
export class CoreModule {}
