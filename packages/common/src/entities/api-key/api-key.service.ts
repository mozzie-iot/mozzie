import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '@huebot/services/crud.service';

import { ApiKeyEntity } from './api-key.entity';

@Injectable()
export class ApiKeyEntityService extends CrudService<ApiKeyEntity> {
  constructor(
    @InjectRepository(ApiKeyEntity)
    protected readonly repository: Repository<ApiKeyEntity>
  ) {
    super();
  }
}
