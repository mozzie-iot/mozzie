import { Module } from '@nestjs/common';

import { NativeClientModule } from '@huebot-api/native-client/native-client.module';

import { NetworkResolver } from './network.resolver';
import { NetworkService } from './network.service';

@Module({
  imports: [NativeClientModule],
  providers: [NetworkService, NetworkResolver],
})
export class NetworkModule {}
