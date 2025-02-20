import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function GET(req: NextRequest) {
  try {
    const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}${req.nextUrl.search}`;

    const isKakaoLogin = targetPath.includes('/auth/login/kakao');
    const isReissue = targetPath.includes('/auth/reissue');

    if (!isKakaoLogin && !isReissue) {
      return NextResponse.json(
        { message: 'Only auth requests should go through proxy' },
        { status: 403 },
      );
    }

    console.log('targetURL: ', targetURL);

    const headers: Record<string, string> = {};
    if (!isKakaoLogin) {
      headers['Authorization'] = req.headers.get('authorization') || '';
      headers['Cookie'] = req.headers.get('cookie') || '';
    }

    console.log('🔄 Proxy GET Request:', targetURL, headers);

    const response = await axios.get(targetURL, {
      headers,
      withCredentials: true,
      httpsAgent,
    });

    const res = NextResponse.json(response.data);
    const setCookieHeader = response.headers['set-cookie'];

    if (setCookieHeader) {
      res.headers.set('Set-Cookie', setCookieHeader[0]);
    }

    return res;
  } catch (error: any) {
    console.error(
      '❌ Proxy Error (GET):',
      error.response?.data || error.message,
    );
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}`;

    // ✅ 로그아웃 요청만 프록시 허용
    if (!targetPath.includes('/auth/logout')) {
      return NextResponse.json(
        { message: 'Only auth requests should go through proxy' },
        { status: 403 },
      );
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: req.headers.get('authorization') || '',
      Cookie: req.headers.get('cookie') || '',
    };

    console.log('🔄 Proxy POST Request:', targetURL, headers);

    const response = await axios.post(targetURL, undefined, {
      headers,
      withCredentials: true,
      httpsAgent,
    });

    const responseData = response.data || { message: 'No response data' };
    const res = NextResponse.json(responseData);
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
    console.error(
      '❌ Proxy Error (POST):',
      error.response?.data || error.message,
    );
    return NextResponse.json(
      {
        message: 'Proxy Error',
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 },
    );
  }
}
