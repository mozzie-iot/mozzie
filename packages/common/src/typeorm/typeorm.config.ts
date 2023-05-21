import os from 'os';

import { DataSourceOptions } from 'typeorm';

import { NodeEnv } from './typeorm.interface';

export const typeormConfig = (env: NodeEnv): DataSourceOptions => {
  if (env === 'production') {
    return {
      type: 'better-sqlite3',
      database: '/usr/db/db.sqlite',
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      migrations: [`${__dirname}/../migrations/*.{ts,js}`],
      synchronize: false,
      dropSchema: false,
      migrationsTableName: 'migrations',
    };
  } else if (env === 'development') {
    return {
      type: 'better-sqlite3',
      database: '/usr/db/db-dev.sqlite',
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      migrations: [`${__dirname}/../migrations/*.{ts,js}`],
      synchronize: true,
      dropSchema: false,
      migrationsTableName: 'migrations',
    };
  } else if (env === 'test') {
    return {
      type: 'better-sqlite3',
      database: `${os.homedir()}/db/db-test.sqlite`,
      entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
      synchronize: true,
      dropSchema: true,
    };
  }
};
