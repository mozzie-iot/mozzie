import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import {
  NetworkApCredentialsDto,
  NetworkDetailUnion,
  NetworkWifiDto,
} from '@huebot-hub-core/common';

@Injectable()
export class NetworkService {
  constructor(@Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy) {}

  public pingNetwork(): boolean {
    return true;
  }

  public getNodeApCredentials() {
    const pattern = { cmd: 'get_ap_credentials' };
    return this.client.send<NetworkApCredentialsDto>(pattern, []);
  }

  public getDetails() {
    const pattern = { cmd: 'get_network_details' };
    return this.client.send<typeof NetworkDetailUnion>(pattern, []);
  }

  public getAvailableWifiNetworks() {
    const pattern = { cmd: 'network_wifi_scan' };
    return this.client.send<NetworkWifiDto[]>(pattern, []);
  }
}
