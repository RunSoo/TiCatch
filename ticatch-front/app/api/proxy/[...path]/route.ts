import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetPath = req.nextUrl.pathname.replace('/api/proxy', '');
    const targetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${targetPath}${url.search}`;

    const headers = {
      ...Object.fromEntries(req.headers),
      'Content-Type': 'application/json',
    };

    const response = await axios.get(targetURL, {
      headers,
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

    const headers = {
      ...Object.fromEntries(req.headers),
      'Content-Type': 'application/json',
    };

    const response = await axios.post(targetURL, body, {
      headers,
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
