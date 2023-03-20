import { promises as fs } from 'fs';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import {
  BasicResponseEnum,
  ConfigEntity,
  ConfigService,
  DataSource,
  UserEntity,
} from '@huebot-hub-core/common';

import { HubInstanceMqttCredentialsDto } from './dto/mqtt-credentials.dto';

interface SetupJwtDecoded {
  user_id: string;
  public_key: string;
  secret: string;
}

interface MqttConfig {
  mqtt_username: string;
  mqtt_password: string;
}

@Injectable()
export class InstanceService {
  constructor(
    @Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy,
    private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) { }

  public async setup(token: string): Promise<BasicResponseEnum> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const artifact_secret = this.configService.SECRET_KEY;

      const { user_id, public_key, secret } = jwt.verify(
        token,
        artifact_secret,
      ) as SetupJwtDecoded;

      // RESET HUB (IF PREVIOUSLY SETUP)

      await this.dataSource.manager.getRepository(ConfigEntity).clear();
      await this.dataSource.manager.getRepository(UserEntity).clear();

      const ap_delete_interface_response = await firstValueFrom(
        this.client.send<BasicResponseEnum>({ cmd: 'delete_ap_interface' }, []),
      );

      if (ap_delete_interface_response === BasicResponseEnum.FAIL) {
        throw Error('Failed to delete AP interface');
      }

      // const existing_instance_secret = await this.dataSource.manager.findOne(
      //   ConfigEntity,
      //   {
      //     where: {
      //       name: 'instance_secret',
      //     },
      //   },
      // );

      // if (existing_instance_secret) {
      //   await queryRunner.manager.remove(existing_instance_secret);
      // }

      // END RESET HUB

      const new_instance = new ConfigEntity();
      new_instance.name = 'instance_secret';
      new_instance.value = secret;
      await queryRunner.manager.save(new_instance);

      const new_user = new UserEntity();
      new_user.user_id = user_id;
      new_user.instance_public_key = public_key;
      await queryRunner.manager.save(new_user);

      const ap_interface_response = await firstValueFrom(
        this.client.send<BasicResponseEnum>({ cmd: 'create_ap_interface' }, []),
      );

      if (ap_interface_response === BasicResponseEnum.FAIL) {
        throw Error('Failed to setup AP interface');
      }

      await queryRunner.commitTransaction();

      return BasicResponseEnum.SUCCESS;
    } catch (error) {
      console.log('InstanceService.setup error: ', error);
      await queryRunner.rollbackTransaction();
      return BasicResponseEnum.FAIL;
    } finally {
      await queryRunner.release();
    }
  }

  public async get_mqtt_credentials(): Promise<HubInstanceMqttCredentialsDto> {
    const config_str = await fs.readFile('/usr/app/mqtt-config.json', {
      encoding: 'utf8',
      flag: 'r',
    });

    const config = JSON.parse(config_str) as MqttConfig;

    return {
      username: config.mqtt_username,
      password: config.mqtt_password,
    };
  }
}
