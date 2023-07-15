import os from 'os';

import { DataSourceOptions } from 'typeorm';

import { NodeEnv } from '@huebot/common';
import * as entities from '@huebot/common/dist/entities';

export const databaseConfig = (env: NodeEnv): DataSourceOptions => {
  if (env === 'production') {
    return {
      type: 'better-sqlite3',
      database: '/usr/db/db.sqlite',
      entities: entities,
      migrations: [`${__dirname}/../migrations/*.{ts,js}`],
      synchronize: false,
      dropSchema: false,
      migrationsTableName: 'migrations',
    };
  } else if (env === 'development') {
    return {
      type: 'better-sqlite3',
      database: '/usr/db/db-dev.sqlite',
      entities: entities,
      migrations: [`${__dirname}/../migrations/*.{ts,js}`],
      synchronize: true,
      dropSchema: false,
      migrationsTableName: 'migrations',
    };
  } else if (env === 'test') {
    return {
      type: 'better-sqlite3',
      database: `${os.homedir()}/db/db-test.sqlite`,
      entities: entities,
      synchronize: true,
      dropSchema: true,
    };
  }
};
