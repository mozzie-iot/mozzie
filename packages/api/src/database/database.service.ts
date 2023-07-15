import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '@huebot/config/config.service';

import { databaseConfig } from './database-config.util';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return databaseConfig(this.configService.NODE_ENV);
  }
}
