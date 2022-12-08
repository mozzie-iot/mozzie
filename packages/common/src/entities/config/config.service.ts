import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '@huebot-common/services/crud.service';

import { ConfigEntity } from './config.entity';

@Injectable()
export class ConfigEntityService extends CrudService<ConfigEntity> {
  constructor(
    @InjectRepository(ConfigEntity)
    protected readonly repository: Repository<ConfigEntity>
  ) {
    super();
  }
}
