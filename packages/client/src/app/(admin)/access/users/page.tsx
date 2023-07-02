import { Metadata } from 'next';
import Link from 'next/link';

import { UserEntity } from '@huebot/common';

import CacheContainer from './components/cache-container';

import { serverFetch } from '@/components/server-fetch';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » Users',
};

const page: React.FunctionComponent = async () => {
  const initialData = await serverFetch<UserEntity[]>(
    'http://api:3000/v1/users/find-all'
  );

  return (
    <>
      <div className="flex justify-between">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Users</h1>
        <Button variant="secondary" asChild>
          <Link href="/access/users/add">Add User</Link>
        </Button>
      </div>
      <div className="py-10">
        <CacheContainer users={initialData} />
      </div>
    </>
  );
};

export default page;
