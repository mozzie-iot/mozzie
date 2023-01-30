import { exec } from 'child_process';

import { Injectable } from '@nestjs/common';
import { Address4 } from 'ip-address';
import generatePassword from 'omgopass';
import UNG from 'unique-names-generator';

import {
  BasicResponseEnum,
  ConfigService,
  NetworkActiveDto,
  NetworkApCredentialsDto,
  NetworkAvailableDto,
  NetworkDetailUnion,
  NetworkIp4AddressTypeEnum,
  NetworkTypeEnum,
  NetworkWifiDto,
} from '@huebot-hub-core/common';

import { NetworkError } from './network.error';

interface NetworkDetailField {
  cmd_key: string;
  parse_key: string;
  field_key: string;
  format?: (value: string) => string;
  connection_type: NetworkTypeEnum[];
}

const AP_NAME = 'hubap';

@Injectable()
export class NetworkService {
  constructor(private readonly configService: ConfigService) {}

  private async cmd_promisify(name: string, cmd: string): Promise<string> {
    return new Promise((resolve, reject) =>
      exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(new NetworkError(name, error ? error.message : stderr));
        }

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

  public async get_available_interfaces(): Promise<NetworkAvailableDto[]> {
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
            .reduce((acc: NetworkAvailableDto[], line: string) => {
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
              ] as NetworkAvailableDto[];
            }, []);

          console.log('get_available_interfaces: ', results);

          return resolve(results);
        },
      ),
    );
  }

  public async ethernet_has_domain(connection_name: string):Promise<boolean>{
    return new Promise((resolve, reject) =>
      exec(`nmcli -t -f IP4.DOMAIN con show "${connection_name}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          return reject(
            new NetworkError(
              'ethernet_has_domain',
              error ? error.message : stderr,
            ),
          );
        }

        resolve(!!stdout)
      }))
  } 

  public async get_active_interface(): Promise<NetworkActiveDto | null> {
    return new Promise((resolve, reject) =>
      exec('nmcli -t -f NAME,TYPE c show --active',async  (error, stdout, stderr) => {
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
        // The only difference in profile between shared ethernet from device and direct ethernet connection
        // is the lack of IP4.DOMAIN when shared. So for now, if the interface is ethernet we will look for IP4.DOMAIN 
        // and if it does not exist we will ignore it


        let interface_parts: string[];

        // Only consider ethernet or wifi interfaces but not interface designated for node AP
        const interfaces = stdout
          .split('\n')
          .filter(
            (int) =>
              int.includes('ethernet') ||
              (int.includes('wireless') && !int.includes(AP_NAME)),
          );

        if (interfaces.length === 0) {
          return resolve(null);
        }

        console.log("FILTERED ACTIVE INTERFACES: ", interfaces)

        // Prefer ethernet connection over WiFi, so let's check for that first
        const ethIndex = interfaces.findIndex((int) => int.includes("ethernet"))

        if(ethIndex > -1) {
            // Lets confirm it's not shared internet over ethernet
            const [name, type] = interfaces[ethIndex].split(":")
            const hasDomain = await this.ethernet_has_domain(name)

            // Deemed not to be shared internet if domain available - this could be flawed logic.. 
            if(hasDomain){
              return resolve({
                name,
                type: NetworkTypeEnum.WIRED,
                type_raw: type.trim(),
              });
            }

            // Else, let's remove this int option
            interfaces.splice(ethIndex, 1)
        }

        console.log("ACTIVE INTERFACES (AFTER ETH): ", interfaces)

        if(interfaces.length ===0){
          return resolve(null);
        }

        // There should only be one active interface by this point so lets
        // throw a warning if that's not the case
        if(interfaces.length > 1){
          console.warn(`Expected at most 1 active interface, but found: ${interfaces.length}`)
        }

        const [name, type] = interfaces[0].split(":")

        // This should be a wifi interface
        if (!type.includes('wireless')) {
          return reject(
            new NetworkError(
              'get_active_interface',
              'Unexpected interface type returned',
            ),
          );
        }

        return resolve({
          name,
          type: NetworkTypeEnum.WIFI,
          type_raw: type.trim(),
        });
      }),
    );
  }

  public async get_active_ssid(): Promise<string | null> {
    const raw_result = await this.cmd_promisify(
      'get_active_ssid',
      'nmcli -t -f active,ssid dev wifi',
    );

    // console.log('get_active_ssid raw: ', raw_result);

    const active_ssid = raw_result
      .split('\n')
      .filter((r) => r.split(':')[0] === 'yes');

    if (active_ssid.length === 0) {
      return null;
    }

    if (active_ssid.length > 1) {
      console.log('get_active_ssid warning: More than 1 active SSID detected');
    }

    return active_ssid[0].split(':')[1];
  }

  public async connect_to_wifi(
    ssid: string,
    password: string,
  ): Promise<BasicResponseEnum> {
    try {
      const available_int = await this.get_available_interfaces();

      const wifi_int = available_int.find((int) => int.type === 'wifi');

      if (!wifi_int) {
        console.log('connect to wifi failed', 'no available interfaces');
        return BasicResponseEnum.FAIL;
      }

      const result = await this.cmd_promisify(
        'connect to wifi',
        `nmcli dev wifi connect "${ssid}" password "${password}" ifname ${wifi_int.name}`,
      );

      if (result.includes('successfully activated')) {
        return BasicResponseEnum.SUCCESS;
      }

      console.log('connect to wifi failed', result);
      return BasicResponseEnum.FAIL;
    } catch (err) {
      console.log('connect to wifi failed', err);
      return BasicResponseEnum.FAIL;
    }
  }

  // 1. Get active interface details
  // 2. Get connection details (type, dynamic/static ip) by interface name
  public async get_network_details(): Promise<typeof NetworkDetailUnion> {
    const active_interface = await this.get_active_interface();

    if (!active_interface) {
      return null;
    }

    const { name, type, type_raw } = active_interface;

    let connection_type: NetworkTypeEnum = null;
    if (type === 'wifi') {
      connection_type = NetworkTypeEnum.WIFI;
    } else if (type === 'wired') {
      connection_type = NetworkTypeEnum.WIRED;
    } else {
      throw Error(`Unsupported network type: ${type}`);
    }

    const fields: NetworkDetailField[] = [
      {
        cmd_key: 'ipv4.method',
        parse_key: 'ipv4.method',
        field_key: 'ip4_address_type',
        format: (value: string) => {
          return value === 'auto'
            ? NetworkIp4AddressTypeEnum.DYNAMIC
            : NetworkIp4AddressTypeEnum.STATIC;
        },
        connection_type: [NetworkTypeEnum.WIRED, NetworkTypeEnum.WIFI],
      },
      {
        cmd_key: 'IP4.ADDRESS',
        parse_key: 'IP4.ADDRESS[1]',
        field_key: 'ip4_address',
        format: (value: string) => {
          // Remove network bit size ("/24")
          return value.split('/')[0];
        },
        connection_type: [NetworkTypeEnum.WIRED, NetworkTypeEnum.WIFI],
      },
      {
        cmd_key: 'IP4.GATEWAY',
        parse_key: 'IP4.GATEWAY',
        field_key: 'ip4_gateway',
        connection_type: [NetworkTypeEnum.WIRED, NetworkTypeEnum.WIFI],
      },
      {
        cmd_key: 'connection.interface-name',
        parse_key: 'connection.interface-name',
        field_key: 'interface_name',
        connection_type: [NetworkTypeEnum.WIRED, NetworkTypeEnum.WIFI],
      },
      {
        cmd_key: `${type_raw}.ssid`,
        parse_key: `${type_raw}.ssid`,
        field_key: 'ssid',
        connection_type: [NetworkTypeEnum.WIFI],
      },
    ];

    const connection_fields = fields.filter((field) =>
      field.connection_type.includes(connection_type),
    );

    const cmdArgs = connection_fields.map((f) => f.cmd_key).join(',');
    const cmd = `nmcli -t -f ${cmdArgs} con show "${name}"`;
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

        console.log('CMD OUTPUT: ', stdout);

        const rows = stdout
          .split('\n')
          .filter((item) => item)
          .map((item) => {
            const row = item.split(':');
            return {
              parse_key: row[0],
              value: row[1],
            };
          });

        // Validate and format output

        const result = connection_fields.reduce(
          (acc: any, field: NetworkDetailField) => {
            const row = rows.find((r) => r.parse_key === field.parse_key);
            console.log('ROW', row);
            if (!row) {
              return { error: `failed to find field ${field.parse_key}` };
            }

            return {
              ...acc,
              values: {
                ...acc.values,
                [field.field_key]: field.format
                  ? field.format(row.value)
                  : row.value,
              },
            };
          },
          { values: { id: name, type: connection_type }, error: null },
        );

        if (result.error) {
          return reject(result.error);
        }

        resolve(result.values);
      }),
    );
  }

  public async set_ip_address_static(
    static_ip: string,
  ): Promise<typeof NetworkDetailUnion> {
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

    await this.cmd_promisify(
      'modfiy interface',
      `
      nmcli con mod "${network.id}" ipv4.addresses ${static_ip}/24 \
      ipv4.gateway ${network.ip4_gateway} \
      ipv4.dns "8.8.8.8" \
      ipv4.method manual
    `,
    );

    await this.cmd_promisify('interface up', `nmcli con up "${network.id}"`);

    return {
      ...network,
      ip4_address: static_ip,
      ip4_address_type: NetworkIp4AddressTypeEnum.STATIC,
    };
  }

  public async set_ip_address_dynamic(): Promise<typeof NetworkDetailUnion> {
    const network = await this.get_network_details();

    if (!network) {
      throw Error('Network not found');
    }

    if (network.ip4_address_type === NetworkIp4AddressTypeEnum.DYNAMIC) {
      return network;
    }

    await this.cmd_promisify(
      'modfiy interface',
      `"${network.id}" ipv4.method auto`,
    );

    await this.cmd_promisify('interface up', `nmcli con up "${network.id}"`);

    const updated_network = await this.get_network_details();

    return updated_network;
  }

  public async create_ap_interface(): Promise<BasicResponseEnum> {
    try {
      const ssid = UNG.uniqueNamesGenerator({
        dictionaries: [UNG.names, UNG.animals],
        separator: '-',
        length: 2,
        style: 'lowerCase',
      });

      const password = generatePassword();

      const ap_if_name = await this.get_ap_interface();

      // Create AP interface
      await this.cmd_promisify(
        'create interface',
        `
        nmcli con add type wifi \
        ifname ${ap_if_name} con-name \
        ${AP_NAME} autoconnect yes ssid ${ssid}
      `,
      );

      const static_ip = `${this.configService.NETWORK_NODE_AP_IP}/24`;

      // nmcli con mod

      // Create AP interface
      await this.cmd_promisify(
        'modfiy interface',
        `
        nmcli con mod ${AP_NAME} 802-11-wireless.mode ap \
        802-11-wireless.band bg ipv4.method shared \
        ipv4.addresses ${static_ip} wifi.hidden true \
        wifi-sec.key-mgmt wpa-psk wifi-sec.psk "${password}"
      `,
      );

      await this.cmd_promisify('interface up', `nmcli con up "${AP_NAME}"`);

      return BasicResponseEnum.SUCCESS;
    } catch (err) {
      console.log('create_ap_interface err', err);
      return BasicResponseEnum.FAIL;
    }
  }

  public async delete_ap_interface(): Promise<BasicResponseEnum> {
    try {
      await this.cmd_promisify('interface down', `nmcli con down ${AP_NAME}`);
      await this.cmd_promisify('delete interface', `nmcli c delete ${AP_NAME}`);
      return BasicResponseEnum.SUCCESS;
    } catch (err) {
      console.log('delete_ap_interface err: ', err);
      return BasicResponseEnum.FAIL;
    }
  }

  public async get_ap_credentials(): Promise<NetworkApCredentialsDto> {
    const ifname = await this.get_ap_interface();

    const output = await this.cmd_promisify(
      'find device',
      `nmcli device wifi show-password ifname ${ifname}`,
    );

    return output.split('\n').reduce(
      (acc: NetworkApCredentialsDto, line) => {
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
