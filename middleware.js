import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/admin')) {
    const cookie = request.cookies.get('prodwm_session');
    if (!cookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };