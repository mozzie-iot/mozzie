import { IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  role: string;
}
