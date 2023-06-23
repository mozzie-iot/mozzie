import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '@huebot/services/crud.service';

import { RoleEntity } from './role.entity';

@Injectable()
export class RoleEntityService extends CrudService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    protected readonly repository: Repository<RoleEntity>
  ) {
    super();
  }
}
