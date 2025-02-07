import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}${req.nextUrl.search}`;

    console.log('✅ [프록시 요청 시작]');
    console.log('➡️ 요청 경로:', req.nextUrl.pathname);
    console.log('➡️ 프록시 대상 URL:', targetURL);

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

    console.log('🔑 전송할 헤더:', headers);

    const response = await axios.get(targetURL, {
      headers,
      withCredentials: true,
    });

    console.log('✅ [프록시 요청 성공]');
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ [프록시 오류 발생]');
    console.error('📥 요청 정보:', {
      method: req.method,
      path: req.nextUrl.pathname,
      query: req.nextUrl.search,
    });

    console.error('📤 응답 정보:', error.response?.data || error.message);
    console.error('⚠️ 에러 상태 코드:', error.response?.status || 500);

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

    console.log('✅ [프록시 POST 요청 시작]');
    console.log('➡️ 프록시 대상 URL:', targetURL);
    console.log('📦 요청 바디:', body);

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

    console.log('🔑 전송할 헤더:', headers);

    const response = await axios.post(targetURL, body, {
      headers,
      withCredentials: true,
    });

    console.log('✅ [프록시 POST 요청 성공]');
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ [프록시 POST 오류 발생]');
    console.error('📥 요청 정보:', {
      method: req.method,
      path: req.nextUrl.pathname,
      body: req.body,
    });

    console.error('📤 응답 정보:', error.response?.data || error.message);
    console.error('⚠️ 에러 상태 코드:', error.response?.status || 500);

    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}
