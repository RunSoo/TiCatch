import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const targetPath = url.pathname.replace('/api/proxy', '');
    const targetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${targetPath}${url.search}`;

    const headers = Object.fromEntries(req.headers);

    const response = await axios.get(targetURL, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ 프록시 오류:', error);
    return NextResponse.json(
      { message: 'Proxy Error' },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const targetPath = url.pathname.replace('/api/proxy', '');
    const targetURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${targetPath}`;

    const headers = Object.fromEntries(req.headers);

    const response = await axios.post(targetURL, body, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('❌ 프록시 오류:', error);
    return NextResponse.json(
      { message: 'Proxy Error' },
      { status: error.response?.status || 500 },
    );
  }
}
