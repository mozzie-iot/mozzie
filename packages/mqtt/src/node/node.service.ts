import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { MQTT_CLIENT, REDIS_CLIENT, Redis } from '@huebot/common';

@Injectable()
export class NodeService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    @Inject(MQTT_CLIENT) private readonly mqttClient: ClientProxy,
  ) {}

  public alive_check() {
    this.mqttClient.emit('alive_check', {});
  }

  public status_online(client_name: string) {
    return this.redisClient.set(`node:${client_name}`, 'online');
  }

  public status_offline(client_name: string) {
    return this.redisClient.del(`node:${client_name}`);
  }

  public sensor(topic: string, payload: string) {
    const client_id = topic.split('/')[1];
    return this.redisClient.set(`sensor:${client_id}`, payload, 'EX', 180);
  }
}
