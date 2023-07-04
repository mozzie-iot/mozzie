import { Metadata } from 'next';

import { UserEntity } from '@huebot/common';

import { InsufficientPermissions } from '../../components/insufficient-permisssions';

import { AddUserButton } from './components/add-user-button';
import CacheContainer from './components/cache-container';

import { serverFetch } from '@/components/server-fetch';
import { AccessRolesEnum } from '@/utils/access-roles.enum';
import { current_user_can } from '@/utils/user-access-server.utils';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » Users',
};

const page: React.FunctionComponent = async () => {
  const user_can = await current_user_can([AccessRolesEnum.USER_READ]);
  if (!user_can) {
    return <InsufficientPermissions />;
  }

  const initialData = await serverFetch<UserEntity[]>(
    'http://api:3000/v1/users/find-all'
  );

  return (
    <>
      <div className="flex justify-between">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Users</h1>
        <AddUserButton />
      </div>
      <div className="py-10">
        <CacheContainer users={initialData} />
      </div>
    </>
  );
};

export default page;
