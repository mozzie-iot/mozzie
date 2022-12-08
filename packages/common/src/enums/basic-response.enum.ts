import { registerEnumType } from '@nestjs/graphql';

export enum BasicResponseEnum {
  SUCCESS = 'success',
  FAIL = 'fail',
}

registerEnumType(BasicResponseEnum, {
  name: 'BasicResponseEnum',
});
