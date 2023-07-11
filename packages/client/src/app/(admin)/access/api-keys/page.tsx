import { Metadata } from 'next';

import { InsufficientPermissions } from '../../components/insufficient-permisssions';

import { AccessRolesEnum } from '@/utils/access-roles.enum';
import { current_user_can } from '@/utils/user-access-server.utils';

export const metadata: Metadata = {
  title: 'Huebot Hub | Access » API Keys',
};

const page: React.FunctionComponent = async () => {
  const user_can = await current_user_can([AccessRolesEnum.ROLE_READ]);
  if (!user_can) {
    return <InsufficientPermissions />;
  }

  return (
    <div className="flex justify-center align-center">
      <h1>API KEYS PAGE!</h1>
    </div>
  );
};

export default page;
