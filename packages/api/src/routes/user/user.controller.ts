import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  ResetPasswordDto,
  UserCreateDto,
  UserEntity,
  UserLoginDto,
  UserUpdateDto,
} from '@huebot/common';
import { Role } from '@huebot/role/role.decorator';
import { RoleEnum } from '@huebot/role/role.enum';

import { AuthGuard } from '../auth.guard';

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
  me(@User() user: UserEntity) {
    return user;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.userService.logout(req, res);
  }

  @Get('find-all')
  @Role(RoleEnum.user_read)
  @UseGuards(AuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Role(RoleEnum.user_read)
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post('update/:id')
  @Role(RoleEnum.user_write)
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() input: UserUpdateDto) {
    return this.userService.update(id, input);
  }

  @Post('reset-password/:id')
  @Role(RoleEnum.user_write)
  @UseGuards(AuthGuard)
  resetPassword(@Param('id') id: string, @Body() input: ResetPasswordDto) {
    return this.userService.resetPassword(id, input);
  }
}
