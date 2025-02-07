import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}${req.nextUrl.search}`;

    console.log('✅ 요청 경로:', req.nextUrl.pathname);
    console.log('➡️ 프록시 대상 URL:', targetURL);

    const cookieHeader = req.headers.get('cookie') || '';
    const authorizationHeader = req.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // ✅ 쿠키 또는 Authorization이 있을 때만 추가
    if (cookieHeader) headers['Cookie'] = cookieHeader;
    if (authorizationHeader) headers['Authorization'] = authorizationHeader;

    const response = await axios.get(targetURL, {
      headers,
      withCredentials: !!cookieHeader, // ✅ 쿠키가 있을 경우에만 전송
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ 프록시 오류:', error.response?.data || error.message);
    return NextResponse.json(
      {
        message: 'Proxy Error',
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${targetPath}`;

    const cookieHeader = req.headers.get('cookie') || '';
    const authorizationHeader = req.headers.get('authorization') || '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cookieHeader) headers['Cookie'] = cookieHeader;
    if (authorizationHeader) headers['Authorization'] = authorizationHeader;

    const response = await axios.post(targetURL, body, {
      headers,
      withCredentials: !!cookieHeader, // ✅ 쿠키가 있을 경우에만 전송
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ 프록시 오류:', error.response?.data || error.message);
    return NextResponse.json(
      {
        message: 'Proxy Error',
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
