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

  get REDIS_PASSWORD() {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  get SESSION_NAME() {
    return this.configService.get<string>('SESSION_NAME');
  }

  get SESSION_SECRET() {
    return this.configService.get<string>('SESSION_SECRET');
  }

  get SESSION_MAX_AGE() {
    return parseInt(this.configService.get<string>('SESSION_MAX_AGE'), 10);
  }

  get MQTT_HOST() {
    return this.configService.get<string>('MQTT_HOST');
  }

  get MQTT_PORT() {
    return parseInt(this.configService.get<string>('MQTT_PORT'), 10);
  }

  get MQTT_USERNAME() {
    return this.configService.get<string>('MQTT_USERNAME');
  }

  get MQTT_PASSWORD() {
    return this.configService.get<string>('MQTT_PASSWORD');
  }

  get HOME() {
    return this.configService.get<string>('HOME');
  }

  get NODE_ENV() {
    return this.configService.get<string>('NODE_ENV');
  }
}
