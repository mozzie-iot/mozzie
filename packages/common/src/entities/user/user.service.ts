import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CrudService } from '@huebot-common/services/crud.service';

import { UserEntity } from './user.entity';

@Injectable()
export class UserEntityService extends CrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>
  ) {
    super();
  }
}
