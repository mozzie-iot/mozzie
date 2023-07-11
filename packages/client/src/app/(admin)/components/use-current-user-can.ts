import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { UserEntity } from '@huebot/common';

import { AccessRolesEnum } from '@/utils/access-roles.enum';

interface HookStateData {
  access: boolean;
}

interface HookState {
  loading: boolean;
  error?: string;
  data?: HookStateData;
}

const getMe = async (): Promise<UserEntity> => {
  const res = await fetch('/api/v1/users/me');
  const json = (await res.json()) as UserEntity;
  return json;
};

export const useCurrentUserCan = (permissions: AccessRolesEnum[]) => {
  const [hookState, setHookState] = useState<HookState>({ loading: true });
  const { data, error } = useQuery(['me'], getMe);

  useEffect(() => {
    if (error) {
      setHookState({ loading: false, error: 'Error loading current user' });
      return;
    }

    if (!data) {
      return;
    }

    if (data.is_admin) {
      setHookState({ loading: false, data: { access: true } });
      return;
    }

    setHookState({
      loading: false,
      data: {
        access: permissions.some((permission) =>
          data.role_access.includes(permission)
        ),
      },
    });
  }, [data, error]);

  return hookState;
};
