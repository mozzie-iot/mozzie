import { Module } from '@nestjs/common';

import { NetworkResolver } from './network.resolver';
import { NetworkService } from './network.service';

@Module({
  providers: [NetworkService, NetworkResolver],
})
export class NetworkModule {}
