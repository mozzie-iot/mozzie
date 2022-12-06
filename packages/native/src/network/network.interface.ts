export interface WifiNetwork {
  ssid: string;
  signal: number;
  security?: string;
  channel?: number;
}

export interface AvailableInterface {
  name: string;
  type: 'wifi' | 'wired';
}

export interface ActiveNetworkInterface {
  name: string;
  type: 'wifi' | 'wired';
  type_raw: string;
}

export interface ApCredentials {
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

interface BaseNetworkDetail {
  id: string;
  type: NetworkTypeEnum;
  ip4_address: string;
  ip4_address_type: NetworkIp4AddressTypeEnum;
  ip4_gateway: string;
  interface_name: string;
}

type NetworkWifiDetail = BaseNetworkDetail & {
  ssid: string;
};

type NetworkWiredDetail = BaseNetworkDetail;

export type NetworkDetailUnion = NetworkWifiDetail | NetworkWiredDetail;
