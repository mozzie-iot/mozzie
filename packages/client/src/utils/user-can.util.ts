import { UserEntity } from '@huebot/common';

import { AccessRolesEnum } from './access-roles.enum';

export const userCanUtil = (user: UserEntity, roles: AccessRolesEnum[]) =>
  user.is_admin ||
  roles.length === 0 ||
  roles.some((role) => user.role_access.includes(role));
