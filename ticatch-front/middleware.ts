import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh-token')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ticket/:path*'],
  // matcher: [],
};
