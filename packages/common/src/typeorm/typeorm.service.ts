import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '@huebot/config';

import { typeormConfig } from './typeorm.config';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  constructor(readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return typeormConfig(this.configService.NODE_ENV);
  }
}
