import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 1️⃣ 모든 쿠키 확인
  console.log('All Cookies:', request.cookies.getAll());

  // 2️⃣ 쿠키 헤더 확인
  const cookieHeader = request.headers.get('cookie');
  console.log('Cookie Header:', cookieHeader);

  // 3️⃣ refresh-token 가져오기
  const refreshToken = request.cookies.get('refresh-token')?.value;

  console.log('REFRESH TOKEN:', refreshToken);

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ticket/:path*'],
  runtime: 'edge',
};
