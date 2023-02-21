import { Module } from '@nestjs/common';

import { ConfigModule } from '@huebot-hub-core/common';

import { NetworkModule } from './network/network.module';

@Module({
  imports: [ConfigModule.forRoot(), NetworkModule],
})
export class AppModule { }
