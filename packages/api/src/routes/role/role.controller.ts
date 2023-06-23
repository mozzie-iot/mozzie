import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Role } from '@huebot/role/role.decorator';
import { RoleEnum } from '@huebot/role/role.enum';

import { AuthGuard } from '../auth.guard';

import { RoleCreateDto } from './dto/create.dto';
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
}
