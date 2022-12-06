import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  ActiveNetworkInterface,
  ApCredentials,
  AvailableInterface,
  NetworkDetailUnion,
  WifiNetwork,
} from './network.interface';
import { NetworkService } from './network.service';

@Controller()
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @MessagePattern({ cmd: 'get_ap_interface' })
  async get_ap_interface(): Promise<string> {
    return this.networkService.get_ap_interface();
  }

  @MessagePattern({ cmd: 'network_wifi_scan' })
  async network_scan_wifi(): Promise<WifiNetwork[]> {
    return this.networkService.scan_wifi();
  }

  @MessagePattern({ cmd: 'get_available_interfaces' })
  async get_available_interfaces(): Promise<AvailableInterface[]> {
    return this.networkService.get_available_interfaces();
  }

  @MessagePattern({ cmd: 'get_active_interface' })
  async get_active_interface(): Promise<ActiveNetworkInterface | null> {
    return this.networkService.get_active_interface();
  }

  @MessagePattern({ cmd: 'get_active_ssid' })
  async get_active_ssid(): Promise<string | null> {
    return this.networkService.get_active_ssid();
  }

  @MessagePattern({ cmd: 'connect_to_wifi' })
  async connect_to_wifi(data: {
    ssid: string;
    password: string;
  }): Promise<boolean> {
    return this.networkService.connect_to_wifi(data.ssid, data.password);
  }

  @MessagePattern({ cmd: 'get_network_details' })
  async get_network_details(): Promise<NetworkDetailUnion> {
    return this.networkService.get_network_details();
  }

  @MessagePattern({ cmd: 'set_ip_address_static' })
  async set_ip_address_static(data: {
    static_ip: string;
  }): Promise<NetworkDetailUnion> {
    return this.networkService.set_ip_address_static(data.static_ip);
  }

  @MessagePattern({ cmd: 'set_ip_address_dynamic' })
  async set_ip_address_dynamic(): Promise<NetworkDetailUnion> {
    return this.networkService.set_ip_address_dynamic();
  }

  @MessagePattern({ cmd: 'create_ap_interface' })
  async create_ap_interface(): Promise<void> {
    return this.networkService.create_ap_interface();
  }

  @MessagePattern({ cmd: 'delete_ap_interface' })
  async delete_ap_interface(): Promise<void> {
    return this.networkService.delete_ap_interface();
  }

  @MessagePattern({ cmd: 'get_ap_credentials' })
  async get_ap_credentials(): Promise<ApCredentials> {
    return this.networkService.get_ap_credentials();
  }
}
