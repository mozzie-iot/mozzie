'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserEntity } from '@huebot/common';

interface Props {
  me: UserEntity;
}

const getMe = async (): Promise<UserEntity> => {
  const res = await fetch('/api/v1/users/me');
  const json = (await res.json()) as UserEntity;
  return json;
};

export const CacheContainer: React.FC<Props> = ({ me }) => {
  useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    initialData: me,
  });

  return null;
};

export default CacheContainer;
