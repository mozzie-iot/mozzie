import { ObjectType } from '@nestjs/graphql';
import { BaseEntity as TypeOrmBaseEntity } from 'typeorm';

@ObjectType()
export class BaseEntity extends TypeOrmBaseEntity {
  public id?: string | number;
}
