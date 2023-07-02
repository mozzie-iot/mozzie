import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { AccessRolesEnum } from '../enums';

export class RoleCreateDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  sort: number;

  // CONTROLLERS
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.CONTROLLER_READ]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.CONTROLLER_WRITE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.CONTROLLER_DELETE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.CONTROLLER_RUN]: boolean;

  // USERS
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.USER_READ]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.USER_WRITE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.USER_DELETE]: boolean;

  // API KEYS
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.API_KEY_READ]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.USER_WRITE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.USER_DELETE]: boolean;

  // ROLES
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.ROLE_READ]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.ROLE_WRITE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.ROLE_DELETE]: boolean;

  // MQTT BROKER ACCESS
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.BROKER_ACCESS_READ]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.BROKER_ACCESS_WRITE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.BROKER_ACCESS_DELETE]: boolean;

  // SYSTEM
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.SYSTEM_READ]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.SYSTEM_WRITE]: boolean;
  @IsBoolean()
  @IsOptional()
  [AccessRolesEnum.SYSTEM_DELETE]: boolean;
}
