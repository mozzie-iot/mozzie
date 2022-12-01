import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '@huebot-common/config';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  constructor(readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'sqlite',
      database: `${this.configService.HOME}/db/${this.configService.DB_NAME}`,
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      synchronize: this.configService.NODE_ENV === 'development',
      dropSchema: false,
    };
  }
}
