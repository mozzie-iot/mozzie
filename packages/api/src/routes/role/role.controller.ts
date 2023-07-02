import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { RoleCreateDto } from '@huebot/common';
import { Role } from '@huebot/role/role.decorator';
import { RoleEnum } from '@huebot/role/role.enum';

import { AuthGuard } from '../auth.guard';

import { RoleService } from './role.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('create')
  @Role(RoleEnum.role_write)
  @UseGuards(AuthGuard)
  create(@Body() input: RoleCreateDto) {
    return this.roleService.create(input);
  }

  @Get('find-all')
  @Role(RoleEnum.role_read)
  @UseGuards(AuthGuard)
  findAll() {
    return this.roleService.findAll();
  }
}
