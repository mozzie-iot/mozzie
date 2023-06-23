'use client';

import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { Fragment } from 'react';

import { UserEntity } from '@huebot/common';

import { NavBarMenu } from './nav-bar-menu';

interface Props {
  user: UserEntity;
}

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Access', href: '/access' },
  { name: 'System', href: '/system' },
  { name: 'Nodes', href: '#' },
];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface NavProps {
  href: string;
  title: string;
  pathname: string;
}

const NavLink: React.FunctionComponent<NavProps> = ({
  href,
  title,
  pathname,
}) => (
  <Link
    href={href}
    className={classNames(
      pathname === href
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
      'rounded-md px-3 py-2 text-sm font-medium'
    )}
    aria-current={pathname === href ? 'page' : undefined}
  >
    {title}
  </Link>
);

export const NavBar: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname() || '/';

  const logout = async () => {
    await fetch('/api/v1/users/logout', {
      method: 'POST',
    });

    router.replace('/login');
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="/images/huebot.svg"
                    alt="Your Company"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <NavLink href="/" title="Dashboard" pathname={pathname} />
                    <NavBarMenu
                      title="Access"
                      routes={[
                        { name: 'Users', href: '/users' },
                        { name: 'API keys', href: '/api-keys' },
                        { name: 'Roles', href: '/roles' },
                      ]}
                    />
                    <NavBarMenu
                      title="System"
                      routes={[{ name: 'MQTT Broker', href: '/mqtt-broker' }]}
                    />
                    <NavLink
                      href="/mqtt-client"
                      title="Client"
                      pathname={pathname}
                    />
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile dropdown */}

                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex max-w-xs items-center rounded-full text-gray-400 hover:text-white focus:outline-none">
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon
                          className="h-8 w-8"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 divide-y divide-gray-100 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <div className="p-3">
                            <div className="text-base text-sm font-medium leading-none truncate">
                              {user.email}
                            </div>
                            {user.is_admin && (
                              <div className="mt-2 text-sm font-medium leading-none text-gray-400">
                                admin
                              </div>
                            )}
                          </div>
                        </Menu.Item>
                        <div>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={logout}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0 text-gray-400">
                  <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
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
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
