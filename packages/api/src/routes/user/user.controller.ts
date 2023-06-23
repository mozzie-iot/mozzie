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

import { UserEntity } from '@huebot/common';
import { Role } from '@huebot/role/role.decorator';
import { RoleEnum } from '@huebot/role/role.enum';

import { AuthGuard } from '../auth.guard';

import { UserCreateDto } from './dto/create.dto';
import { UserLoginDto } from './dto/login.dto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}

  // Used ONLY for initial hub creation
  @Post('create-admin')
  create_admin(@Body() input: UserCreateDto) {
    return this.userService.create_admin(input);
  }

  @Post('create')
  @Role(RoleEnum.user_write)
  @UseGuards(AuthGuard)
  create(@Body() input: UserCreateDto) {
    return this.userService.create(input);
  }

  @Post('login')
  login(@Req() req: Request, @Body() input: UserLoginDto) {
    return this.userService.login(req, input);
  }

  @Get('me')
  current_user(@User() user: UserEntity) {
    return user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.userService.logout(req, res);
  }
}
