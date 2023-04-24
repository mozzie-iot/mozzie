import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UserEntity } from '@huebot-hub-core/common';

import { Roles } from '../../roles/roles.decorator';
import { RolesGuard } from '../../roles/roles.guard';

import { UserCreateDto } from './dto/create.dto';
import { UserLoginDto } from './dto/login.dto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async create(@Body() input: UserCreateDto) {
    return this.userService.create(input);
  }

  @Post('login')
  async login(@Req() req: Request, @Body() input: UserLoginDto) {
    return this.userService.login(req, input);
  }

  @Get('me')
  async current_user(@User() user: UserEntity) {
    return user;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.userService.logout(req, res);
  }
}
