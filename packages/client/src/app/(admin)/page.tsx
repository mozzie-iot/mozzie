import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Huebot Hub | Dashboard',
};

const page: React.FunctionComponent = async () => {
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
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
