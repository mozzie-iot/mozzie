import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NodeController {
  logger = new Logger('NodeController');

  @EventPattern('status/online/+')
  onOnline(data: Record<string, unknown>) {
    console.log('NODE ONLINE', data);
  }

  @EventPattern('status/offline/+')
  onOffline(data: Record<string, unknown>) {
    console.log('NODE OFFLINE', data);
  }
}
