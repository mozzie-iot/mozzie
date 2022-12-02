import { Module } from '@nestjs/common';

import { NetworkModule } from './modules/network/network.module';

@Module({
  imports: [NetworkModule],
})
export class RoutesModule {}
