import { Module } from '@nestjs/common';

import { MqttModule, RedisModule, UserEntityModule } from '@huebot/common';

import { NodeController } from './node.controller';
import { NodeService } from './node.service';

@Module({
  imports: [UserEntityModule, MqttModule, RedisModule],
  providers: [NodeService],
  controllers: [NodeController],
})
export class NodeModule {}
