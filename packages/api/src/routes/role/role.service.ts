import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity, RoleCreateDto } from '@huebot/common';
import { DatabaseCrudService } from '@huebot/database/database-crud.service';

@Injectable()
export class RoleService extends DatabaseCrudService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    protected readonly repository: Repository<RoleEntity>,
  ) {
    super();
  }

  public async create(input: RoleCreateDto) {
    const role = new RoleEntity();
    Object.assign(role, input);
    await this.repository.save(role);
    return role;
  }

  public async findAll() {
    return this.repository.find();
  }
}
