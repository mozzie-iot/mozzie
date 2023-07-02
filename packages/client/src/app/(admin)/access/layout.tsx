import React from 'react';

import SubNav from './components/sub-nav';

const navItems = [
  {
    name: 'Users',
    href: '/access/users',
  },
  {
    name: 'Roles',
    href: '/access/roles',
  },
  {
    name: 'API Keys',
    href: '/access/api-keys',
  },
];

interface Props {
  children: React.ReactNode;
}

const AccessLayout: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <SubNav nav_items={navItems} />
      <main className="py-6 lg:gap-10 lg:py-8">{children}</main>
    </div>
  );
};

export default AccessLayout;
