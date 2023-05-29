import { IsNotEmpty, IsString } from 'class-validator';

export class NodeRetrieveDto {
  @IsNotEmpty()
  @IsString()
  client_id: string;
}
