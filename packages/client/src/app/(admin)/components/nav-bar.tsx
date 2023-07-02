'use client';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react';

import { UserEntity, AccessRolesEnum } from '@huebot/common';

import UserNav from './user-nav';

import { Icons } from '@/components/ui/icon';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

interface Props {
  user: UserEntity;
}

const navigation = [
  { name: 'Dashboard', href: '/', roles: [] },
  {
    name: 'Access',
    href: '/access/users',
    role: [AccessRolesEnum.ROLE_READ, AccessRolesEnum.USER_READ],
  },
  { name: 'Broker', href: '#', roles: [] },
  { name: 'Controllers', href: '#', roles: [] },
];

const userNavigation = [{ name: 'Settings', href: '#', icon: Settings }];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export const NavBar: React.FunctionComponent<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '/';

  const logout = async () => {
    setLoading(true);
    try {
      await fetch('/api/v1/users/logout', {
        method: 'POST',
      });
    } catch (error) {
      setLoading(false);
    }

    router.replace('/login');
  };

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="/images/huebot.svg"
                    alt="Huebot"
                  />
                </div>
                <div className="hidden md:block">
                  <NavigationMenu className="ml-20">
                    <NavigationMenuList>
                      {navigation.map((item) => {
                        console.log(user);
                        return (
                          <NavigationMenuItem key={item.href}>
                            <Link href={item.href} legacyBehavior passHref>
                              <NavigationMenuLink
                                active={
                                  item.href.split('/')[1] ===
                                  pathname.split('/')[1]
                                }
                                className={navigationMenuTriggerStyle()}
                              >
                                {item.name}
                              </NavigationMenuLink>
                            </Link>
                          </NavigationMenuItem>
                        );
                      })}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <UserNav
                    user={user}
                    nav_items={userNavigation}
                    logout={logout}
                    loading={loading}
                  />
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 active:bg-accent focus:outline-none focus:ring-0 focus:ring-offset-0">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-white absolute bottom-0 left-0 top-16 right-0">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : '',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Icons.user className="h-8 w-8" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-gray-400">
                    {user.email}
                  </div>
                  {user.is_admin && (
                    <div className="mt-1 text-sm font-medium leading-none text-gray-400">
                      admin
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : '',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}

                <button
                  className="flex rounded-md px-3 py-2 text-base font-medium w-full items-center "
                  onClick={logout}
                  disabled={loading}
                >
                  Logout
                  {loading && (
                    <Icons.spinner className="ml-2 h-4 w-4 animate-spin" />
                  )}
                </button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
