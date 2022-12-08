import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectDataSource } from '@nestjs/typeorm';
import jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import {
  BasicResponseEnum,
  ConfigEntity,
  ConfigService,
  UserEntity,
} from '@huebot-hub-core/common';

interface SetupJwtDecoded {
  user_id: string;
  public_key: string;
  secret: string;
}

@Injectable()
export class InstanceService {
  constructor(
    @Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy,
    @InjectDataSource() private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

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

      const existing_instance_secret = await this.dataSource.manager.findOne(
        ConfigEntity,
        {
          where: {
            name: 'instance_secret',
          },
        },
      );

      if (existing_instance_secret) {
        await queryRunner.manager.remove(existing_instance_secret);
      }

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
}
