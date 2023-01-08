import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import {
  BasicResponseEnum,
  NetworkApCredentialsDto,
  NetworkAvailableDto,
  NetworkDetailUnion,
  NetworkWifiDto,
} from '@huebot-hub-core/common';

@Injectable()
export class NetworkService {
  constructor(@Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy) {}

  public pingNetwork(): boolean {
    return true;
  }

  public getDetails() {
    const pattern = { cmd: 'get_network_details' };
    return this.client.send<typeof NetworkDetailUnion>(pattern, []);
  }

  public setIpAddressStatic(ip: string) {
    const pattern = { cmd: 'set_ip_address_static' };
    return this.client.send<typeof NetworkDetailUnion>(pattern, { ip });
  }

  public setIpAddressDynamic() {
    const pattern = { cmd: 'set_ip_address_dynamic' };
    return this.client.send<typeof NetworkDetailUnion>(pattern, []);
  }

  public getAvailableWifiNetworks() {
    const pattern = { cmd: 'network_wifi_scan' };
    return this.client.send<NetworkWifiDto[]>(pattern, []);
  }

  public getApInterface() {
    const pattern = { cmd: 'get_ap_interface' };
    return this.client.send<string>(pattern, []);
  }

  public getAvailableInterfaces() {
    const pattern = { cmd: 'get_available_interfaces' };
    return this.client.send<NetworkAvailableDto[]>(pattern, []);
  }

  public getActiveInterface() {
    const pattern = { cmd: 'get_active_interface' };
    return this.client.send<NetworkAvailableDto | null>(pattern, []);
  }

  public getActiveSSID() {
    const pattern = { cmd: 'get_active_ssid' };
    return this.client.send<string | null>(pattern, []);
  }

  public connectToWifi(ssid: string, password: string) {
    const pattern = { cmd: 'connect_to_wifi' };
    return this.client.send<BasicResponseEnum>(pattern, { ssid, password });
  }

  public getNodeApCredentials() {
    const pattern = { cmd: 'get_ap_credentials' };
    return this.client.send<NetworkApCredentialsDto>(pattern, []);
  }

  public createApInterface() {
    const pattern = { cmd: 'create_ap_interface' };
    return this.client.send<BasicResponseEnum>(pattern, []);
  }

  public deleteApInterface() {
    const pattern = { cmd: 'delete_ap_interface' };
    return this.client.send<BasicResponseEnum>(pattern, []);
  }
}
