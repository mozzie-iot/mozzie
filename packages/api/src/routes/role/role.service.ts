import { Injectable } from '@nestjs/common';

import { RoleEntityService, RoleEntity } from '@huebot/common';

import { RoleCreateDto } from './dto/create.dto';

@Injectable()
export class RoleService {
  constructor(private roleService: RoleEntityService) {}

  public async create(input: RoleCreateDto) {
    const role = new RoleEntity();
    Object.assign(role, input);
    await this.roleService.save(role);
    return role;
  }
}
