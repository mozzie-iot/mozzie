import { User, LogOut, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { UserEntity } from '@huebot/common';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/ui/icon';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface Props {
  user: UserEntity;
  nav_items: NavItem[];
  logout: () => void;
  loading: boolean;
}

const UserNav: React.FC<Props> = ({ user, nav_items, logout, loading }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <div>
            <Icons.user className="h-5 w-5" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user.email}</p>
            {user.is_admin && (
              <p className="text-xs leading-none text-muted-foreground">
                Admin
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {nav_items.map((item) => (
            <DropdownMenuItem
              key={item.href}
              className="hover:cursor-pointer"
              asChild
            >
              <Link href={item.href} passHref>
                <User className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          disabled={loading}
          className="hover:cursor-pointer"
        >
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
