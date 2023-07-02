'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NavItems {
  name: string;
  href: string;
}

interface Props {
  nav_items: NavItems[];
}

//
const SubNav: React.FC<Props> = ({ nav_items }) => {
  const pathname = usePathname();

  return (
    <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-4.5rem)] w-full shrink-0 md:sticky md:block">
      <div className="relative overflow-hidden h-full py- pr-6 lg:py-8">
        <ScrollArea>
          <div className="grid grid-flow-row auto-rows-max text-sm space-y-2">
            {nav_items.map((item) => (
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
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default SubNav;
