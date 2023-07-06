'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect } from 'react';

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table_data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  table_data,
}: DataTableProps<TData, TValue>) {
  const { loading, data, error } = useCurrentUser();

  const table = useReactTable({
    data: table_data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => {
        if (column.id === 'actions') {
          if (
            !userCanUtil(data.current_user, [
              AccessRolesEnum.USER_WRITE,
              AccessRolesEnum.USER_DELETE,
            ])
          ) {
            column.toggleVisibility(false);
          }
        }
      });
  }, [data]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error || !data) {
    console.error('Failed to load current user');
    return null;
  }

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
