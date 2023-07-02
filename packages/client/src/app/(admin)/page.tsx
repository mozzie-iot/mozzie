import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Huebot Hub | Dashboard',
};

const page: React.FunctionComponent = () => {
  return (
    <>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center align-center">
            <h1>DASHBOARD PAGE!</h1>
          </div>
        </div>
      </main>
    </>
  );
};

export default page;
