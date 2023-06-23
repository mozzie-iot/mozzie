import { UserEntity } from '@huebot/common';

import { NavBar } from './components/nav-bar';

import { serverFetch } from '@/components/server-fetch';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await serverFetch<UserEntity>('http://api:3000/v1/users/me');

  return (
    <div className="min-h-full">
      <NavBar user={user} />
      {children}
    </div>
  );
}
