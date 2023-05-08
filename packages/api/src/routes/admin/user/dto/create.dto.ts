import { IsNotEmpty } from 'class-validator';

export class AdminUserCreateDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
