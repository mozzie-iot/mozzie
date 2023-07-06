'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useCurrentUser } from '../../components/use-current-user';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AccessRolesEnum } from '@/utils/access-roles.enum';
import { userCanUtil } from '@/utils/user-can.util';

interface NavItems {
  name: string;
  href: string;
  roles: AccessRolesEnum[];
}

interface NavMenuProps {
  nav_items: NavItems[];
}

const NavMenu: React.FC<NavMenuProps> = ({ nav_items }) => {
  const pathname = usePathname();
  const { loading, data, error } = useCurrentUser();

  if (loading) {
    return (
      <div className="space-y-4">
        {nav_items.map((item) => (
          <Skeleton key={item.name} className="h-4 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <h2>Something went terribly wrong</h2>;
  }

  return nav_items
    .filter((item) => userCanUtil(data.current_user, item.roles))
    .map((item) => (
      <Link
        key={item.href}
        className={cn(
          pathname === item.href
            ? 'font-medium text-foreground'
            : 'text-muted-foreground',
          'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline '
        )}
        href={item.href}
      >
        {item.name}
      </Link>
    ));
};

interface Props {
  nav_items: NavItems[];
}
//
const SubNav: React.FC<Props> = ({ nav_items }) => {
  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-4.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="relative overflow-hidden h-full py- pr-6 lg:py-8">
        <ScrollArea>
          <div className="grid grid-flow-row auto-rows-max text-sm space-y-2">
            <NavMenu nav_items={nav_items} />
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default SubNav;
