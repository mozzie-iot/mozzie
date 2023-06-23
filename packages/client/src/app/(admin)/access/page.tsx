import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Huebot Hub | Dashboard',
};

const page: React.FunctionComponent = async () => {
  return (
    <div className="flex justify-center align-center">
      <h1>ACCESS PAGE!</h1>
    </div>
  );
};

export default page;
