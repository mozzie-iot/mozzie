import { NextResponse, type NextRequest } from 'next/server';

export const config = {
  matcher: [
    // Excludes the following paths from middleware
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|images|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  let is_auth = false;

  const session_cookie = request.cookies.get(process.env.SESSION_NAME || '');

  if (!session_cookie) {
    is_auth = false;
  } else {
    const res = await fetch('http://api:3000/v1/users/me', {
      method: 'GET',
      headers: {
        Cookie: `${process.env.SESSION_NAME}=${session_cookie.value}`,
      },
    });

    const resStr = await res.text();

    if (resStr) {
      is_auth = true;
    }
  }

  if (request.nextUrl.pathname.startsWith('/login')) {
    if (is_auth) {
      const url = request.nextUrl;
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next();
    response.cookies.delete(process.env.SESSION_NAME || '');
    return response;
  }

  if (!is_auth) {
    const url = request.nextUrl;
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
