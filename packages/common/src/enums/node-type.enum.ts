import { registerEnumType } from '@nestjs/graphql';

export enum NodeTypeEnum {
  INPUT = 'input',
  OUTPUT = 'output',
}

registerEnumType(NodeTypeEnum, {
  name: 'NodeTypeEnum',
});
