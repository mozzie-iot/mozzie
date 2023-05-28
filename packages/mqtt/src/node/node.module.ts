import { Module } from '@nestjs/common';

import { MqttModule, RedisModule } from '@huebot/common';

import { NodeController } from './node.controller';
import { NodeService } from './node.service';

@Module({
  imports: [RedisModule, MqttModule],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
