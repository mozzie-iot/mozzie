import { Module } from '@nestjs/common';

import { ConfigModule } from '@huebot-hub-core/common';

import { NetworkModule } from './network/network.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      api_key: undefined,
      secret_key: undefined,
      mqtt_username: undefined,
      mqtt_password: undefined,
    }),
    NetworkModule,
  ],
})
export class AppModule { }
