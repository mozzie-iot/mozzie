import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoleCreateDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  // USERS
  @IsBoolean()
  @IsOptional()
  user_read: boolean;
  @IsBoolean()
  @IsOptional()
  user_write: boolean;
  @IsBoolean()
  @IsOptional()
  user_delete: boolean;

  // API KEYS
  @IsBoolean()
  @IsOptional()
  api_key_read: boolean;
  @IsBoolean()
  @IsOptional()
  api_key_write: boolean;
  @IsBoolean()
  @IsOptional()
  api_key_delete: boolean;

  // ROLES
  @IsBoolean()
  @IsOptional()
  role_read: boolean;
  @IsBoolean()
  @IsOptional()
  role_write: boolean;
  @IsBoolean()
  @IsOptional()
  role_delete: boolean;

  // NODES
  @IsBoolean()
  @IsOptional()
  node_read: boolean;
  @IsBoolean()
  @IsOptional()
  node_write: boolean;
}
