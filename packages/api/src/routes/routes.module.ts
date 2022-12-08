import { Module } from '@nestjs/common';

import { AuthRouteModule } from './auth/auth.module';
import { InstanceModule } from './modules/instance/instance.module';
import { NetworkModule } from './modules/network/network.module';

@Module({
  imports: [AuthRouteModule, NetworkModule, InstanceModule],
})
export class RoutesModule {}
