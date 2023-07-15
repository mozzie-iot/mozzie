import { UserEntity } from '@huebot/common';

import { AccessRolesEnum } from './access-roles.enum';

import { serverFetch } from '@/components/server-fetch';

export const current_user_can = async (permissions: AccessRolesEnum[]) => {
  const user = await serverFetch<UserEntity>('http://api:3000/v1/users/me');

  if (!user) {
    throw Error('Unexpected undefined server response');
  }

  if (user.is_admin) {
    return true;
  }

  return permissions.some((permission) =>
    user.role_access.includes(permission)
  );
};
