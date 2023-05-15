import os from 'os';

import { DataSourceOptions } from 'typeorm';

import { NodeEnv } from './typeorm.interface';

export const typeormConfig = (env: NodeEnv): DataSourceOptions => {
  if (env === 'production') {
    return {
      type: 'sqlite',
      database: '/usr/db/db.sqlite',
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      migrations: [`${__dirname}/../migrations/*.{ts,js}`],
      synchronize: false,
      dropSchema: false,
      migrationsTableName: 'migrations',
    };
  } else if (env === 'development') {
    return {
      type: 'sqlite',
      database: '/usr/db/db-dev.sqlite',
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      migrations: [`${__dirname}/../migrations/*.{ts,js}`],
      synchronize: true,
      dropSchema: false,
      migrationsTableName: 'migrations',
    };
  } else if (env === 'test') {
    return {
      type: 'sqlite',
      database: `${os.homedir()}/db/db-test.sqlite`,
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      synchronize: true,
      dropSchema: true,
    };
  }
};
