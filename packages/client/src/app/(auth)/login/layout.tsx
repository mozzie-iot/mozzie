import Image from 'next/image';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Huebot Hub | Login',
};

interface Props {
  children: ReactNode;
}

const Layout: React.FunctionComponent<Props> = ({ children }) => (
  <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <Image
        src="/images/huebot.svg"
        alt="Huebot Logo"
        className="mx-auto h-20 w-auto"
        width={100}
        height={24}
        priority
      />
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in
      </h2>
    </div>
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">{children}</div>
  </div>
);

export default Layout;
