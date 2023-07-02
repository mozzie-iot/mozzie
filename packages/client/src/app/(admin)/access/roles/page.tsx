import { Metadata } from 'next';

import { RoleEntity } from '@huebot/common';

import { serverFetch } from '@/components/server-fetch';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » Roles',
};

const page: React.FunctionComponent = async () => {
  const roles = await serverFetch<RoleEntity[]>(
    'http://api:3000/v1/roles/find-all'
  );

  console.log(roles);

  return (
    <div className="flex justify-center align-center">
      <h1>ROLES PAGE!</h1>
    </div>
  );
};

export default page;
