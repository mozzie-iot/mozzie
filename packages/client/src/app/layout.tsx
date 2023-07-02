import './globals.css';

import { Inter } from 'next/font/google';
import React from 'react';

import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FunctionComponent<Props> = async ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/images/favicon.ico"
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
