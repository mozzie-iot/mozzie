'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserEntity } from '@huebot/common';

import { columns } from './columns';
import { DataTable } from './data-table';

interface Props {
  users: UserEntity[];
}

const getUsers = async (): Promise<UserEntity[]> => {
  const res = await fetch('/api/v1/users/find-all');
  const json = (await res.json()) as UserEntity[];
  return json;
};

export const CacheContainer: React.FC<Props> = ({ users }) => {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    initialData: users,
  });

  return <DataTable columns={columns} data={data} />;
};

export default CacheContainer;
