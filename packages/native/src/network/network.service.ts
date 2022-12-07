import { exec } from 'child_process';

import { Injectable } from '@nestjs/common';
import { Address4 } from 'ip-address';
import generatePassword from 'omgopass';
import UNG from 'unique-names-generator';

import {
  ConfigService,
  NetworkActiveInterface,
  NetworkApCredentials,
  NetworkAvailableInterface,
  NetworkDetailUnion,
  NetworkIp4AddressTypeEnum,
  NetworkTypeEnum,
  NetworkWifiDto,
} from '@huebot-hub-core/common';

import { NetworkError } from './network.error';

const AP_NAME = 'hubap';

@Injectable()
export class NetworkService {
  constructor(private readonly configService: ConfigService) {}

  // To do: should probably indicate interface id (using ifname) based on user selection (if multiple)
  // when setting up hub - maybe set it as env var
  private async create_interface(args: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
      exec(`sudo nmcli con add type wifi ${args}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError(
              'create_interface',
              error ? error.message : stderr,
            ),
          );
        }

        console.log('create_interface output: ', stdout);

        return resolve(true);
      }),
    );
  }

  private async delete_interface(con_name: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
      exec(`sudo nmcli c delete ${con_name}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError(
              'delete_interface',
              error ? error.message : stderr,
            ),
          );
        }

        console.log('delete_interface output: ', stdout);

        return resolve(true);
      }),
    );
  }

  private async interface_mod(action: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
      exec(`sudo nmcli con mod ${action}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError('interface_mod', error ? error.message : stderr),
          );
        }

        console.log('interface_mod output: ', stdout);

        return resolve(true);
      }),
    );
  }

  private async interface_down(interface_id: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
      exec(`sudo nmcli con down "${interface_id}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError('interface_down', error ? error.message : stderr),
          );
        }

        console.log('interface_down output: ', stdout);

        return resolve(true);
      }),
    );
  }

  private async interface_up(interface_id: string): Promise<boolean> {
    return new Promise((resolve, reject) =>
      exec(`sudo nmcli con up "${interface_id}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError('interface_up', error ? error.message : stderr),
          );
        }

        console.log('interface_up output: ', stdout);

        return resolve(true);
      }),
    );
  }

  private async nmcli_device(args: string): Promise<string> {
    return new Promise((resolve, reject) =>
      exec(`sudo nmcli device ${args}`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError('nmcli_device', error ? error.message : stderr),
          );
        }

        console.log('nmcli_device output: ', stdout);

        return resolve(stdout);
      }),
    );
  }

  // Return WiFi interface that the AP (mqtt) is using (setup on install)
  public async get_ap_interface(): Promise<string> {
    return new Promise((resolve, reject) =>
      exec(
        "sed -n '/^interface=/s///p' /etc/NetworkManager/dnsmasq.d/00-dnsmasq-config.conf",
        (error, stdout, stderr) => {
          if (error || stderr) {
            return reject(
              new NetworkError(
                'get_ap_interface',
                error ? error.message : stderr,
              ),
            );
          }

          // To do: incorporate this in sed commmand
          const int = stdout.replace(/['"]+/g, '');

          console.log('get_ap_interface output: ', int);

          return resolve(int.trim());
        },
      ),
    );
  }
  public scan_wifi(): Promise<NetworkWifiDto[]> {
    return new Promise((resolve, reject) =>
      exec(
        'nmcli --get-value SSID,SIGNAL,SECURITY device wifi',
        (error, stdout, stderr) => {
          if (error || stderr) {
            return reject(error ? error.message : stderr);
          }

          const rows = stdout.split('\n');

          const result = rows.reduce((acc: NetworkWifiDto[], item) => {
            const row = item.split(':');

            // if req'd wifi components missing, then skip
            if (row.length !== 3) {
              return acc;
            }

            return [
              {
                ssid: row[0],
                signal: parseInt(row[1], 10),
                security: row[2],
              },
              ...acc,
            ];
          }, []);

          return resolve(result);
        },
      ),
    );
  }
  public async get_available_interfaces(): Promise<
    NetworkAvailableInterface[]
  > {
    return new Promise((resolve, reject) =>
      exec(
        'nmcli  -t -f DEVICE,TYPE,STATE device status',
        async (error, stdout, stderr) => {
          if (error || stderr) {
            return reject(
              new NetworkError(
                'get_available_interfaces',
                error ? error.message : stderr,
              ),
            );
          }

          // Get interface being used by MQTT so we can exclude from options below
          const ap_interface = await this.get_ap_interface();

          const results = stdout
            .split('\n')
            .reduce((acc: NetworkAvailableInterface[], line: string) => {
              if (!line.includes(':ethernet:') && !line.includes(':wifi:')) {
                return acc;
              }

              const [name, type, state] = line.split(':');

              // Exclude MQTT interface or unmanaged interface
              if (name === ap_interface || state === 'unmanaged') {
                return acc;
              }

              return [
                ...acc,
                { name, type: type === 'wifi' ? 'wifi' : 'wired' },
              ] as NetworkAvailableInterface[];
            }, []);

          console.log('get_available_interfaces: ', results);

          return resolve(results);
        },
      ),
    );
  }

  public async get_active_interface(): Promise<NetworkActiveInterface | null> {
    return new Promise((resolve, reject) =>
      exec('nmcli -t -f NAME,TYPE c show --active', (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError(
              'get_active_interface',
              error ? error.message : stderr,
            ),
          );
        }

        // Note: in order to test wifi setup/connection you need to connect to hub
        // via ethernet to computer (so you can view terminal output). This connection will create
        // an IP on the ethernet interface that wont work when app attemtps to test a
        // a connection using the IP address
        // Solution for now: In development env, if we detect 2 interfaces we will use the
        // 2nd option (which will be wifi) but in production env we will use the first (in a
        // situation where ethernet and wifi are connected) because prefer ethernet as it is
        // stronger.

        let interface_parts: string[];

        // Only consider ethernet or wifi interfaces
        const interfaces = stdout
          .split('\n')
          .filter(
            (int) => int.includes('ethernet') || int.includes('wireless'),
          );

        if (interfaces.length === 0) {
          return resolve(null);
        }

        if (this.configService.NODE_ENV === 'development') {
          interface_parts =
            interfaces.length > 1
              ? interfaces[1].split(':')
              : interfaces[0].split(':');
        } else {
          interface_parts = interfaces[0].split(':');
        }

        if (interface_parts.length !== 2) {
          return reject(
            new NetworkError(
              'get_active_interface',
              'Unexpected result returned',
            ),
          );
        }

        const [name, type] = interface_parts;

        if (!type.includes('wireless') && !type.includes('ethernet')) {
          return reject(
            new NetworkError(
              'get_active_interface',
              'Unexpected interface type returned',
            ),
          );
        }

        return resolve({
          name,
          type: type.includes('wireless') ? 'wifi' : 'wired',
          type_raw: type.trim(),
        });
      }),
    );
  }

  public async get_active_ssid(): Promise<string | null> {
    return new Promise((resolve, reject) =>
      exec('nmcli -t -f active,ssid dev wifi', (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError('get_active_ssid', error ? error.message : stderr),
          );
        }

        const result = stdout.split(':');
        return resolve(result[1]);
      }),
    );
  }

  public async connect_to_wifi(
    ssid: string,
    password: string,
  ): Promise<boolean> {
    const available_int = await this.get_available_interfaces();

    const wifi_int = available_int.find((int) => int.type === 'wifi');

    if (!wifi_int) {
      return false;
    }

    return new Promise((resolve, reject) =>
      exec(
        `sudo nmcli dev wifi connect "${ssid}" password "${password}" ifname ${wifi_int.name}`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            return reject(
              new NetworkError(
                'connect_to_wifi',
                error ? error.message : stderr,
              ),
            );
          }

          if (stdout.includes('successfully activated')) {
            return resolve(true);
          }

          return resolve(false);
        },
      ),
    );
  }

  // 1. Get active interface details
  // 2. Get connection details (type, dynamic/static ip) by interface name
  public async get_network_details(): Promise<NetworkDetailUnion> {
    const active_interface = await this.get_active_interface();

    if (!active_interface) {
      return null;
    }

    const { name, type, type_raw } = active_interface;

    let cmd = '';

    if (type === 'wifi') {
      cmd = `nmcli -t -g ipv4.method,IP4.ADDRESS,IP4.GATEWAY,${type_raw}.ssid,connection.interface-name con show "${name}"`;
    }

    if (type === 'wired') {
      cmd = `nmcli -t -g ipv4.method,IP4.ADDRESS,IP4.GATEWAY,connection.interface-name con show "${name}"`;
    }

    console.log('RUNNING CMD: ', cmd);

    return new Promise((resolve, reject) =>
      exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError(
              'get_network_details',
              error ? error.message : stderr,
            ),
          );
        }

        console.log('RAW RESULTS: ', stdout);

        const results = stdout.split('\n').filter((item) => item);

        console.log('RESULTS: ', results);

        if (type === 'wifi') {
          return resolve({
            id: name,
            type: NetworkTypeEnum.WIFI,
            ip4_address: results[3].split('/')[0],
            ip4_address_type:
              results[0] === 'auto'
                ? NetworkIp4AddressTypeEnum.DYNAMIC
                : NetworkIp4AddressTypeEnum.STATIC,
            ip4_gateway: results[4],
            ssid: results[1],
            interface_name: results[2],
          });
        }

        resolve({
          id: name,
          type: NetworkTypeEnum.WIRED,
          ip4_address: results[2].split('/')[0],
          ip4_address_type:
            results[0] === 'auto'
              ? NetworkIp4AddressTypeEnum.DYNAMIC
              : NetworkIp4AddressTypeEnum.STATIC,
          ip4_gateway: results[3],
          interface_name: results[1],
        });
      }),
    );
  }

  public async set_ip_address_static(
    static_ip: string,
  ): Promise<NetworkDetailUnion> {
    try {
      // First validate IP address
      new Address4(static_ip);
    } catch (error) {
      throw error;
    }

    const network = await this.get_network_details();

    if (!network) {
      throw Error('Network not found');
    }

    console.log('NETWORK DETAILS: ', network);

    // Bail if already static
    if (network.ip4_address_type === NetworkIp4AddressTypeEnum.STATIC) {
      return network;
    }

    await this.interface_mod(`"${network.id}" ipv4.addresses ${static_ip}/24`);

    await this.interface_mod(
      `"${network.id}" ipv4.gateway ${network.ip4_gateway}`,
    );

    await this.interface_mod(`"${network.id}" ipv4.dns "8.8.8.8"`);

    await this.interface_mod(`"${network.id}" ipv4.method manual`);

    await this.interface_up(network.id);

    return {
      ...network,
      ip4_address: static_ip,
      ip4_address_type: NetworkIp4AddressTypeEnum.STATIC,
    };
  }

  public async set_ip_address_dynamic(): Promise<NetworkDetailUnion> {
    const network = await this.get_network_details();

    if (!network) {
      throw Error('Network not found');
    }

    if (network.ip4_address_type === NetworkIp4AddressTypeEnum.DYNAMIC) {
      return network;
    }

    await this.interface_mod(`"${network.id}" ipv4.method auto`);
    await this.interface_up(network.id);

    const updated_network = await this.get_network_details();

    return updated_network;
  }

  public async create_ap_interface(): Promise<void> {
    const ssid = UNG.uniqueNamesGenerator({
      dictionaries: [UNG.names, UNG.animals],
      separator: '-',
      length: 2,
      style: 'lowerCase',
    });

    const password = generatePassword();

    const ap_if_name = await this.get_ap_interface();

    await this.create_interface(
      `ifname ${ap_if_name} con-name ${AP_NAME} autoconnect yes ssid ${ssid}`,
    );

    const static_ip = `${this.configService.NETWORK_NODE_AP_IP}/24`;

    await this.interface_mod(
      `${AP_NAME} 802-11-wireless.mode ap 802-11-wireless.band bg ipv4.method shared ipv4.addresses ${static_ip} wifi.hidden true wifi-sec.key-mgmt wpa-psk wifi-sec.psk "${password}"`,
    );

    await this.interface_up(AP_NAME);
    return;
  }

  public async delete_ap_interface(): Promise<void> {
    await this.interface_down(AP_NAME);
    await this.delete_interface(AP_NAME);
    return;
  }

  public async get_ap_credentials(): Promise<NetworkApCredentials> {
    const ifname = await this.get_ap_interface();

    const output = await this.nmcli_device(
      `wifi show-password ifname ${ifname}`,
    );

    return output.split('\n').reduce(
      (acc: NetworkApCredentials, line) => {
        if (line.includes('SSID')) {
          return {
            ...acc,
            ssid: line.split(':')[1].trim(),
          };
        }

        if (line.includes('Password')) {
          return {
            ...acc,
            password: line.split(':')[1].trim(),
          };
        }

        return acc;
      },
      { ssid: null, password: null },
    );
  }
}
