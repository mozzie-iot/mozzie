import { UserEntity } from '@huebot/common';

export const findUserMe = async () => {
  const res = await fetch('/api/v1/users/me');
  const json = (await res.json()) as UserEntity;
  return json;
};

export const findAllUsers = async () => {
  const res = await fetch('/api/v1/users/find-all');
  const json = (await res.json()) as UserEntity[];
  return json;
};

export const findOneUser = async (id: string) => {
  const res = await fetch(`/api/v1/users/${id}`);
  const json = (await res.json()) as UserEntity;
  return json;
};
