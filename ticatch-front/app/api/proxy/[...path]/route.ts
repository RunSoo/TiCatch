import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}${req.nextUrl.search}`;

    console.log('✅ 요청 경로:', req.nextUrl.pathname);
    console.log('➡️ 프록시 대상 URL:', targetURL);

    const response = await axios.get(targetURL, {
      headers: {
        Authorization: req.headers.get('authorization') || '',
        Cookie: req.headers.get('cookie') || '',
      },
      withCredentials: true,
    });

    const res = response.data
      ? NextResponse.json(response.data)
      : new NextResponse(null, { status: response.status });

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      console.log('🍪 Set-Cookie 헤더 발견:', setCookieHeader);
      res.headers.set('Set-Cookie', setCookieHeader[0]);
    } else {
      console.log('❌ Set-Cookie 없음');
    }

    return res;
  } catch (error: any) {
    console.error('❌ 프록시 오류:', error);
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

    // ✅ 빈 응답 처리 강화
    if (
      response.status === 204 ||
      response.data === undefined ||
      response.data === null ||
      (typeof response.data === 'string' && !response.data.trim())
    ) {
      console.log('ℹ️ 빈 응답 또는 204 No Content');
      return new NextResponse(null, { status: response.status });
    }

    const res = NextResponse.json(response.data);
    const setCookieHeader = response.headers['set-cookie'];

    if (setCookieHeader) {
      console.log('🍪 Set-Cookie 헤더 발견:', setCookieHeader);
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) =>
          res.headers.append('Set-Cookie', cookie),
        );
      } else {
        res.headers.set('Set-Cookie', setCookieHeader);
      }
    } else {
      console.log('❌ Set-Cookie 없음');
    }

    return res;
  } catch (error: any) {
    console.error('❌ [프록시 POST 오류 발생]');
    console.error('📥 요청 정보:', {
      method: req.method,
      path: req.nextUrl.pathname,
      body: req.body,
    });

    if (error.response) {
      console.error('📤 응답 정보:', error.response.data);
      return NextResponse.json(
        {
          message: 'Proxy Error',
          details: error.message,
          backendError: error.response.data,
        },
        { status: error.response.status },
      );
    }

    console.error('⚠️ 네트워크 오류 또는 서버 응답 없음:', error.message);
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: 500 },
    );
  }
}
