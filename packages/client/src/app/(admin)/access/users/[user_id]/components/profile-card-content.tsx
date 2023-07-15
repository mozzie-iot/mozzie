'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { RoleEntity, UserEntity } from '@huebot/common';

import UserProfileForm from './profile-form';

import { findOneUser } from '@/client-queries';

interface Props {
  user: UserEntity;
  roles: RoleEntity[];
}

export const ProfileCardContent: React.FC<Props> = ({ user, roles }) => {
  const { data, isFetched } = useQuery({
    queryKey: ['user', { id: user.id }],
    queryFn: () => findOneUser(user.id),
    initialData: user,
  });

  if (!isFetched) {
    return <h1>Loading...</h1>;
  }

  return <UserProfileForm user={data} roles={roles} />;
};
