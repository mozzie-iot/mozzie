import { SetMetadata } from '@nestjs/common';

import { RoleEnum } from './role.enum';

export const Role = (role: RoleEnum) => SetMetadata('role', role);
