import { Injectable } from '@nestjs/common';

import { RoleEntityService, RoleEntity, RoleCreateDto } from '@huebot/common';

@Injectable()
export class RoleService {
  constructor(private roleService: RoleEntityService) {}

  public async create(input: RoleCreateDto) {
    const role = new RoleEntity();
    Object.assign(role, input);
    await this.roleService.save(role);
    return role;
  }

  public async findAll() {
    return this.roleService.repo.find();
  }
}
