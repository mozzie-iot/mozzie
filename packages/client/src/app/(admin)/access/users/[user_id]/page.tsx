import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { RoleEntity, UserEntity } from '@huebot/common';

import { UserDeleteButton } from './components/delete-button';
import { ProfileCardContent } from './components/profile-card-content';
import ResetPasswordForm from './components/reset-password-form';

import { InsufficientPermissions } from '@/app/(admin)/components/insufficient-permisssions';
import { serverFetch } from '@/components/server-fetch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AccessRolesEnum } from '@/utils/access-roles.enum';
import { current_user_can } from '@/utils/user-access-server.utils';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » Users » Edit',
};

interface Params {
  user_id: string;
}

interface NextPageProps {
  params: Params;
}

const Page: React.FC<NextPageProps> = async ({ params }) => {
  const user_can = await current_user_can([AccessRolesEnum.USER_WRITE]);

  if (!user_can) {
    return <InsufficientPermissions />;
  }

  const user = await serverFetch<UserEntity | undefined>(
    `http://api:3000/v1/users/${params.user_id}`
  );

  const roles = await serverFetch<RoleEntity[]>(
    'http://api:3000/v1/roles/find-all'
  );

  if (!user) {
    return notFound();
  }

  if (!roles) {
    console.log('Unexpected undefined server response ');
    return null;
  }

  return (
    <div className="container mx-auto max-w-screen-sm">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
        User Settings
      </h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileCardContent user={user} roles={roles} />
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Set temporary password for user to regain access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm user={user} />
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardContent className="pt-6">
          <UserDeleteButton user={user} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
