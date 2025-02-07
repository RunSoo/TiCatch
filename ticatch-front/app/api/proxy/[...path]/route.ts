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

    return NextResponse.json(response.data);
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

    const response = await axios.post(targetURL, body, {
      headers: {
        Authorization: req.headers.get('authorization') || '',
        Cookie: req.headers.get('cookie') || '',
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ 프록시 오류:', error);
    return NextResponse.json(
      { message: 'Proxy Error', details: error.message },
      { status: error.response?.status || 500 },
    );
  }
}
