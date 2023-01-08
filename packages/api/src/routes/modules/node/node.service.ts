import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { NATIVE_CLIENT_PROVIDER } from '@huebot-api/native-client/native-client.constants';
import {
  ConfigService,
  DataSource,
  NetworkApCredentialsDto,
  NodeChannelEntity,
  NodeEntity,
  NodeEntityService,
} from '@huebot-hub-core/common';

import { NodeSetupCredentialsDto } from './dto/setup.dto';
import { CreateNodeInput } from './inputs/input.create';

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeService: NodeEntityService,
    private dataSource: DataSource,
    @Inject(NATIVE_CLIENT_PROVIDER) private client: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  public async create(input: CreateNodeInput): Promise<NodeEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Delete Node if it already exists - resetting
      const existing_node = await queryRunner.manager.findOne(NodeEntity, {
        where: { public_key: input.public_key },
      });

      if (existing_node) {
        await queryRunner.manager.remove(existing_node);
      }

      const new_node = new NodeEntity();
      new_node.id = input.instance_key;
      new_node.public_key = input.public_key;
      new_node.name = input.model_name;
      new_node.nickname = input.nickname;
      new_node.type = input.type;
      const saved_node = await queryRunner.manager.save(new_node);

      const node_channels = await Promise.all(
        input.channels.map(async (inputChannel) => {
          const new_channel = new NodeChannelEntity();
          new_channel.name = inputChannel.name;
          new_channel.channel = inputChannel.channel;
          new_channel.node = saved_node;
          return queryRunner.manager.save(new_channel);
        }),
      );

      await queryRunner.commitTransaction();

      return Object.assign(saved_node, { channels: node_channels });
    } catch (error) {
      console.log('NodeService.create error: ', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async get_setup_credentials(): Promise<NodeSetupCredentialsDto> {
    const ap = await firstValueFrom(
      this.client.send<NetworkApCredentialsDto>(
        { cmd: 'get_ap_credentials' },
        [],
      ),
    );

    return {
      ap_ssid: ap.ssid,
      ap_password: ap.password,
      mqtt_username: this.configService.MQTT_USERNAME,
      mqtt_password: this.configService.MQTT_PASSWORD,
    };
  }

  public async findAll(): Promise<NodeEntity[]> {
    return this.nodeService.repo.createQueryBuilder('nodes').getMany();
  }
}
