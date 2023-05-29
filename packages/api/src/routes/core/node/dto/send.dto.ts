import { IsNotEmpty, IsString } from 'class-validator';

export class NodeSendDto {
  @IsNotEmpty()
  @IsString()
  topic: string;
  @IsNotEmpty()
  @IsString()
  payload: string;
}
