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

import { ApiKeyService } from './api-key.service';
import { ApiKeyCreateDto } from './dto/create.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'api-keys', version: '1' })
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Post('create')
  @Role(RoleEnum.api_key_write)
  @UseGuards(AuthGuard)
  create(@Body() input: ApiKeyCreateDto) {
    return this.apiKeyService.create(input);
  }
}
