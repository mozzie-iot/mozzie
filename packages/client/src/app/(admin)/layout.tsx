import React from 'react';

import { UserEntity } from '@huebot/common';

import { NavBar } from './components/nav-bar';

import { serverFetch } from '@/components/server-fetch';

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FunctionComponent<Props> = async ({ children }) => {
  const user = await serverFetch<UserEntity>('http://api:3000/v1/users/me');

  if (!user) {
    console.log('Unexpected undefined server response ');
    return null;
  }

  return (
    <div>
      <div className="md:border-b">
        <NavBar user={user} />
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
