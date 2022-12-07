export interface NetworkWifi {
  ssid: string;
  signal: number;
  security?: string;
  channel?: number;
}

export interface NetworkAvailableInterface {
  name: string;
  type: 'wifi' | 'wired';
}

export interface NetworkActiveInterface {
  name: string;
  type: 'wifi' | 'wired';
  type_raw: string;
}

export interface NetworkApCredentials {
  ssid: string;
  password: string;
}

export enum NetworkTypeEnum {
  WIRED = 'wired',
  WIFI = 'wifi',
}

export enum NetworkIp4AddressTypeEnum {
  STATIC = 'static',
  DYNAMIC = 'dynamic',
}

interface NetworkBaseDetail {
  id: string;
  type: NetworkTypeEnum;
  ip4_address: string;
  ip4_address_type: NetworkIp4AddressTypeEnum;
  ip4_gateway: string;
  interface_name: string;
}

type NetworkWifiDetail = NetworkBaseDetail & {
  ssid: string;
};

type NetworkWiredDetail = NetworkBaseDetail;

export type NetworkDetailUnion = NetworkWifiDetail | NetworkWiredDetail;
