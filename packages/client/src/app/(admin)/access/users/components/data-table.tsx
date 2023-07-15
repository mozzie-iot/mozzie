'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { UserEntity } from '@huebot/common';

import { useCurrentUser } from '@/app/(admin)/components/use-current-user';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AccessRolesEnum } from '@/utils/access-roles.enum';
import { userCanUtil } from '@/utils/user-can.util';

interface DataTableProps<TValue> {
  columns: ColumnDef<UserEntity, TValue>[];
  table_data: UserEntity[];
}

export function DataTable<TValue>({
  columns,
  table_data,
}: DataTableProps<TValue>) {
  const { loading, data: user_data, error } = useCurrentUser();
  const router = useRouter();

  const table = useReactTable({
    data: table_data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!user_data) {
      return;
    }

    table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => {
        if (column.id === 'actions') {
          if (
            !userCanUtil(user_data.current_user, [
              AccessRolesEnum.USER_WRITE,
              AccessRolesEnum.USER_DELETE,
            ])
          ) {
            column.toggleVisibility(false);
          }
        }
      });
  }, [user_data]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error || !user_data) {
    console.error('Failed to load current user');
    return null;
  }

  const user_can =
    user_data.current_user.is_admin ||
    [AccessRolesEnum.USER_WRITE].some((permission) =>
      user_data.current_user.role_access.includes(permission)
    );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={user_can ? 'hover:cursor-pointer' : ''}
                onClick={() => {
                  if (!user_can) {
                    return;
                  }

                  router.push(`/access/users/${row.original.id}`);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}