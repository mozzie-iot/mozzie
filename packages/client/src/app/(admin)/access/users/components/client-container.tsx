'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserEntity } from '@huebot/common';

import { columns } from './columns';
import { DataTable } from './data-table';

import { findAllUsers } from '@/client-queries';

interface Props {
  users: UserEntity[];
}

export const ClientContainer: React.FC<Props> = ({ users }) => {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: findAllUsers,
    initialData: users,
  });

  return <DataTable columns={columns} table_data={data} />;
};

export default ClientContainer;
