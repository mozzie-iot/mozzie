import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get API_PORT() {
    return parseInt(this.configService.get<string>('API_PORT'), 10);
  }

  get DB_NAME() {
    return this.configService.get<string>('DB_NAME');
  }

  get SECRET_KEY() {
    return this.configService.get<string>('SECRET_KEY');
  }

  get REDIS_HOST() {
    return this.configService.get<string>('REDIS_HOST');
  }

  get REDIS_PORT() {
    return parseInt(this.configService.get<string>('REDIS_PORT'), 10);
  }

  get HOME() {
    return this.configService.get<string>('HOME');
  }

  get NODE_ENV() {
    return this.configService.get<string>('NODE_ENV');
  }
}
