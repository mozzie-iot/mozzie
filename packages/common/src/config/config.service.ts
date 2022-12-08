import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get API_PORT() {
    return parseInt(this.configService.get<string>('API_PORT'), 10);
  }

  get REDIS_HOST() {
    return this.configService.get<string>('REDIS_HOST');
  }

  get REDIS_PORT() {
    return parseInt(this.configService.get<string>('REDIS_PORT'), 10);
  }

  get NETWORK_NODE_AP_IP() {
    return this.configService.get<string>('NETWORK_NODE_AP_IP');
  }

  get MQTT_HOST() {
    return this.configService.get<string>('MQTT_HOST');
  }

  get MQTT_PORT() {
    return parseInt(this.configService.get<string>('MQTT_PORT'), 10);
  }

  get NATIVE_HOST() {
    return this.configService.get<string>('NATIVE_HOST');
  }

  get NATIVE_PORT() {
    return parseInt(this.configService.get<string>('NATIVE_PORT'), 10);
  }

  get MQTT_USERNAME() {
    return this.configService.get<string>('MQTT_USERNAME');
  }

  get MQTT_PASSWORD() {
    return this.configService.get<string>('MQTT_PASSWORD');
  }

  get API_KEY() {
    return this.configService.get<string>('HUEBOT_API_KEY');
  }

  get SECRET_KEY() {
    return this.configService.get<string>('HUEBOT_SECRET_KEY');
  }

  get HOME() {
    return this.configService.get<string>('HOME');
  }

  get NODE_ENV() {
    return this.configService.get<string>('NODE_ENV');
  }
}
