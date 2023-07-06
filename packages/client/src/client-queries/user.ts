import { UserEntity } from '@huebot/common';

export const findUserMe = async (): Promise<UserEntity> => {
  const res = await fetch('/api/v1/users/me');
  const json = (await res.json()) as UserEntity;
  return json;
};

export const findAllUsers = async (): Promise<UserEntity[]> => {
  const res = await fetch('/api/v1/users/find-all');
  const json = (await res.json()) as UserEntity[];
  return json;
};
