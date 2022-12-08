import { Module } from '@nestjs/common';

import { AuthRouteModule } from './auth/auth.module';
import { NetworkModule } from './modules/network/network.module';

@Module({
  imports: [AuthRouteModule, NetworkModule],
})
export class RoutesModule {}
