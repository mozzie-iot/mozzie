import { Inject, Injectable } from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

import { ClientProxy, MQTT_CLIENT, REDIS_CLIENT, Redis } from '@huebot/common';

import { NodeRetrieveDto } from './dto/retrieve.dto';
import { NodeSendDto } from './dto/send.dto';

@Injectable()
export class NodeService {
  constructor(
    @Inject(MQTT_CLIENT) private readonly mqttClient: ClientProxy,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  public async online(): Promise<string[]> {
    const nodes = await this.redisClient.keys('node:*');
    return nodes.map((node) => node.split(':')[1]);
  }

  public send(input: NodeSendDto): Observable<any> {
    return this.mqttClient.send(input.topic, input.payload).pipe(timeout(5000));
  }

  public async sensor(input: NodeRetrieveDto): Promise<string> {
    return this.redisClient.get(`sensor:${input.client_id}`);
  }
}
