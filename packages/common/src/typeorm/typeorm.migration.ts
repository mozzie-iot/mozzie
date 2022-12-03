import { DataSource } from 'typeorm';

import { typeormConfig } from './typeorm.config';

const typeormMigration = new DataSource(typeormConfig(process.env.NODE_ENV));

export default typeormMigration;
