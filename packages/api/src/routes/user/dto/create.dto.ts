import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsUUID()
  @IsOptional()
  role: string;
}
