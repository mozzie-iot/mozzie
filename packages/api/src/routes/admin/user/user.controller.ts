import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { AdminUserCreateDto } from './dto/create.dto';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async create(@Body() input: AdminUserCreateDto) {
    return this.userService.create(input);
  }
}
