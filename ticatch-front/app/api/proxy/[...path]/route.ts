import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const getHeaders = (req: NextRequest) => {
  const headers: Record<string, string> = {};

  const authToken = req.headers.get('authorization');
  const cookie = req.headers.get('cookie');

  if (authToken && authToken != 'Bearer undefined') {
    headers['Authorization'] = authToken;
  }

  if (cookie) {
    const uniqueCookies = cookie
      .split('; ')
      .filter((value, index, self) => self.indexOf(value) === index)
      .join('; ');
    headers['Cookie'] = uniqueCookies;
  }

  return headers;
};

export async function GET(req: NextRequest) {
  try {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${backendURL}${targetPath}${req.nextUrl.search}`;

    console.log('✅ 요청 경로:', req.nextUrl.pathname);
    console.log('➡️ 프록시 대상 URL:', targetURL);

    const response = await axios.get(targetURL, {
      headers: getHeaders(req),
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ [프록시 GET 오류 발생]');
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      console.log('빈 바디 요청');
    }

    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${targetPath}`;

    console.log('✅ [프록시 POST 요청 시작]');
    console.log('➡️ 프록시 대상 URL:', targetURL);
    console.log('📦 요청 바디:', body);

    const response = await axios.post(targetURL, body, {
      headers: getHeaders(req),
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ [프록시 POST 오류 발생]');
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}
