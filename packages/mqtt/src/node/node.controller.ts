import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';

import { NodeService } from './node.service';

@Controller()
export class NodeController {
  logger = new Logger('NodeController');

  constructor(private readonly nodeService: NodeService) {}

  @EventPattern('status/online')
  onOnline(client_name: string) {
    return this.nodeService.status_online(client_name);
  }

  @EventPattern('status/offline')
  onOffline(client_name: string) {
    return this.nodeService.status_offline(client_name);
  }

  @MessagePattern('sensor/+')
  from_node(@Ctx() context: MqttContext, @Payload() data: string) {
    return this.nodeService.sensor(context.getTopic(), data);
  }
}
