import { Metadata } from 'next';

import { RoleEntity } from '@huebot/common';

import { InsufficientPermissions } from '../../components/insufficient-permisssions';

import { serverFetch } from '@/components/server-fetch';
import { AccessRolesEnum } from '@/utils/access-roles.enum';
import { current_user_can } from '@/utils/user-access-server.utils';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » Roles',
};

const page: React.FunctionComponent = async () => {
  const user_can = await current_user_can([AccessRolesEnum.ROLE_READ]);
  if (!user_can) {
    return <InsufficientPermissions />;
  }

  const roles = await serverFetch<RoleEntity[]>(
    'http://api:3000/v1/roles/find-all'
  );

  return (
    <div className="flex justify-center align-center">
      <h1>ROLES PAGE!</h1>
    </div>
  );
};

export default page;
