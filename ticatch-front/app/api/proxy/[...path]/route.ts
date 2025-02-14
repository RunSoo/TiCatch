import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}${req.nextUrl.search}`;

    const response = await axios.get(targetURL, {
      headers: {
        Authorization: req.headers.get('authorization') || '',
        Cookie: req.headers.get('cookie') || '',
      },
      withCredentials: true,
    });

    const res = NextResponse.json(response.data);
    const setCookieHeader = response.headers['set-cookie'];

    if (setCookieHeader) {
      res.headers.set('Set-Cookie', setCookieHeader[0]);
    }

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${targetPath}`;

    const isLoginRequest = targetPath.includes('/auth/login');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!isLoginRequest) {
      const authToken = req.headers.get('authorization') || '';
      const cookie = req.headers.get('cookie') || '';

      if (authToken) headers['Authorization'] = authToken;
      if (cookie) headers['Cookie'] = cookie;
    }

    const response = await axios.post(targetURL, body, {
      headers,
      withCredentials: true,
    });

    const res = NextResponse.json(response.data);
    const setCookieHeader = response.headers['set-cookie'];

    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        res.headers.set('Set-Cookie', setCookieHeader[0]);
      } else {
        res.headers.set('Set-Cookie', setCookieHeader);
      }
    }

    return res;
  } catch (error: any) {
    console.log('POST 프록시 에러: ', error);
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}
