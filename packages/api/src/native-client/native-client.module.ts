import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { ConfigService } from '@huebot-hub-core/common';

import { NATIVE_CLIENT_PROVIDER } from './native-client.constants';

const nativeClientProvider = {
  provide: NATIVE_CLIENT_PROVIDER,
  useFactory: (config: ConfigService) => {
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: config.NATIVE_HOST,
        port: config.NATIVE_PORT,
      },
    });
  },
  inject: [ConfigService],
};

@Module({
  providers: [nativeClientProvider],
  exports: [nativeClientProvider],
})
export class NativeClientModule {}
