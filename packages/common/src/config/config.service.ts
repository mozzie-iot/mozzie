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

  get ACCESS_TOKEN_SECRET() {
    return this.configService.get<string>('ACCESS_TOKEN_SECRET');
  }

  get REFRESH_TOKEN_SECRET() {
    return this.configService.get<string>('REFRESH_TOKEN_SECRET');
  }

  get ACCESS_TOKEN_EXP() {
    return this.configService.get<string>('ACCESS_TOKEN_EXP');
  }

  get REFRESH_TOKEN_EXP() {
    return this.configService.get<string>('REFRESH_TOKEN_EXP');
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
