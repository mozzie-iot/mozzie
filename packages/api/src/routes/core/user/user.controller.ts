import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AccessTokenGuard } from '@huebot-api/auth/guards/access-token.guard';
import { RefreshTokenGuard } from '@huebot-api/auth/guards/refresh-token.guard';
import { Roles } from '@huebot-api/roles/roles.decorator';
import { RolesGuard } from '@huebot-api/roles/roles.guard';
import { UserEntity } from '@huebot-hub-core/common';

import { UserCreateDto } from './dto/create.dto';
import { UserLoginDto } from './dto/login.dto';
import { User } from './user.decorator';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @Roles('admin')
  @UseGuards(AccessTokenGuard, RolesGuard)
  async create(@Body() input: UserCreateDto) {
    return this.userService.create(input);
  }

  @Post('login')
  async login(@Body() input: UserLoginDto) {
    return this.userService.login(input);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async current_user(@User() user: UserEntity) {
    return user;
  }

  @Post('logout')
  @UseGuards(AccessTokenGuard)
  async logout(@User() user: UserEntity) {
    return this.userService.logout(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh_tokens(@User() user: UserEntity) {
    return this.userService.refreshTokens(user);
  }
}
