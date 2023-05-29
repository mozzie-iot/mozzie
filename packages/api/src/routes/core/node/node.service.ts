import { Inject, Injectable } from '@nestjs/common';
import { Observable, timeout } from 'rxjs';

import { ClientProxy, MQTT_CLIENT } from '@huebot/common';

import { NodeSendDto } from './dto/send.dto';

@Injectable()
export class NodeService {
  constructor(@Inject(MQTT_CLIENT) private readonly mqttClient: ClientProxy) {}

  public send(input: NodeSendDto): Observable<any> {
    return this.mqttClient.send(input.topic, input.payload).pipe(timeout(5000));
  }
}
