import { DataSource } from 'typeorm';

import { typeormConfig } from './typeorm.config';
import { NodeEnv } from './typeorm.interface';

const typeormMigration = new DataSource(
  typeormConfig(process.env.NODE_ENV as NodeEnv)
);

export default typeormMigration;
