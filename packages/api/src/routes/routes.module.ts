import { Module } from '@nestjs/common';

import { AuthRouteModule } from './auth/auth.module';
import { InstanceModule } from './modules/instance/instance.module';
import { NetworkModule } from './modules/network/network.module';
import { NodeModule } from './modules/node/node.module';

@Module({
  imports: [AuthRouteModule, NetworkModule, InstanceModule, NodeModule],
})
export class RoutesModule {}
