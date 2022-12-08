import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import jwt from 'jsonwebtoken';
import { firstValueFrom } from 'rxjs';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import {
  BasicResponseEnum,
  ConfigEntity,
  ConfigEntityService,
  ConfigService,
} from '@huebot-hub-core/common';

interface SetupJwtDecoded {
  user: string;
  public_key: string;
  secret: string;
}

@Injectable()
export class InstanceService {
  constructor(
    @Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy,
    private readonly configService: ConfigService,
    private readonly configEntityService: ConfigEntityService,
  ) {}

  public async setup(token: string): Promise<BasicResponseEnum> {
    try {
      const artifact_secret = this.configService.SECRET_KEY;

      const { secret } = jwt.verify(token, artifact_secret) as SetupJwtDecoded;

      const existing_instance_secret =
        await this.configEntityService.repo.findOne({
          where: {
            name: 'instance_secret',
          },
        });

      if (existing_instance_secret) {
        await this.configEntityService.repo.remove(existing_instance_secret);
      }

      const new_instance = new ConfigEntity();
      new_instance.name = 'instance_secret';
      new_instance.value = secret;
      await this.configEntityService.save(new_instance);

      const ap_interface_response = await firstValueFrom(
        this.client.send<BasicResponseEnum>({ cmd: 'create_ap_interface' }, []),
      );

      if (ap_interface_response === BasicResponseEnum.FAIL) {
        return BasicResponseEnum.FAIL;
      }

      return BasicResponseEnum.SUCCESS;
    } catch (error) {
      console.log('InstanceService.setup error: ', error);
      return BasicResponseEnum.FAIL;
    }
  }
}
