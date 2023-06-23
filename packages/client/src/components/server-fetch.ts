import { cookies } from 'next/headers';

const SESSION_NAME = process.env.SESSION_NAME;

export const serverFetch = async <TResponse>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<TResponse> => {
  if (!SESSION_NAME) {
    throw Error(
      'serverFetch failed: environment variable "SESSION_NAME" not found'
    );
  }

  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_NAME);

  if (!session) {
    const res = await fetch(input, init);
    return res.json() as Promise<TResponse>;
  }

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init && init.headers ? init.headers : {}),
      Cookie: `${SESSION_NAME}=${session.value}`,
    },
  });

  return res.json() as Promise<TResponse>;
};
