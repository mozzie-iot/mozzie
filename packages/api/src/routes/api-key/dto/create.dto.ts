import { IsNotEmpty, IsString } from 'class-validator';

export class ApiKeyCreateDto {
  @IsNotEmpty()
  @IsString()
  nickname: string;
  @IsNotEmpty()
  role: string;
}
