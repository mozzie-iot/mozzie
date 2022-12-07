import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import { NetworkWifiDto } from '@huebot-hub-core/common';

@Injectable()
export class NetworkService {
  constructor(@Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy) {}

  public pingNetwork(): boolean {
    return true;
  }

  public getAvailableWifiNetworks() {
    const pattern = { cmd: 'network_wifi_scan' };
    return this.client.send<NetworkWifiDto[]>(pattern, []);
  }
}
