'use client';

import Link from 'next/link';
import React from 'react';

import { useCurrentUserCan } from '@/app/(admin)/components/use-current-user-can';
import { Button } from '@/components/ui/button';
import { AccessRolesEnum } from '@/utils/access-roles.enum';

export const AddUserButton: React.FC = () => {
  const { loading, data, error } = useCurrentUserCan([
    AccessRolesEnum.USER_WRITE,
  ]);

  if (loading) {
    return null;
  }

  if (error || !data) {
    console.error(error || 'Unexpected error occurrec');
    return null;
  }

  if (!data.access) {
    return null;
  }

  return (
    <Button variant="secondary" asChild>
      <Link href="/access/users/add">Add User</Link>
    </Button>
  );
};
