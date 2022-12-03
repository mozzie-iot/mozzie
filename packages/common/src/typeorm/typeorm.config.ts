import { DataSourceOptions } from 'typeorm';

export const typeormConfig = (env: string): DataSourceOptions => ({
  type: 'sqlite',
  database: `/usr/db/${env === 'production' ? 'db.sqlite' : 'db-dev.sqlite'}`,
  entities: [`${__dirname}/../entities/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/../migrations/*.{ts,js}`],
  synchronize: env === 'development',
  dropSchema: false,
  migrationsTableName: 'migrations',
});
