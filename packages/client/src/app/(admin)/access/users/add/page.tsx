import { Metadata } from 'next';

import { RoleEntity } from '@huebot/common';

import AddUserForm from './components/form';

import { serverFetch } from '@/components/server-fetch';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » Users » Add',
};

const page: React.FunctionComponent = async () => {
  const roles = await serverFetch<RoleEntity[]>(
    'http://api:3000/v1/roles/find-all'
  );

  return (
    <div className="container mx-auto max-w-screen-sm">
      <h1 className="scroll-m-20 mb-10 text-4xl font-bold tracking-tight">
        Add User
      </h1>

      <AddUserForm roles={roles} />
    </div>
  );
};

export default page;
