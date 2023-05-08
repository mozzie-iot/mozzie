import { Module } from '@nestjs/common';

import { ConfigModule } from '@huebot-hub-core/common';

import { NodeModule } from './node/node.module';

@Module({
  imports: [ConfigModule, NodeModule],
})
export class AppModule {}
