import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { UserEntity } from '@huebot/common';

import { findUserMe } from '@/client-queries';

interface CurrentUser {
  current_user: UserEntity;
}

interface HookState {
  loading: boolean;
  error?: string;
  data?: CurrentUser;
}

export const useCurrentUser = () => {
  const [hookState, setHookState] = useState<HookState>({ loading: true });
  const { data, error } = useQuery(['me'], findUserMe);

  useEffect(() => {
    if (error) {
      setHookState({ loading: false, error: 'Error loading current user' });
      return;
    }

    if (!data) {
      return;
    }

    setHookState({ loading: false, data: { current_user: data } });
  }, [data, error]);

  return hookState;
};
