import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  const body = await req.json();
  const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${req.url.replace('/api/proxy', '')}`;

  try {
    const response = await axios.post(backendURL, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Proxy Error' },
      { status: error.response?.status || 500 },
    );
  }
}

export async function GET(req: Request) {
  const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}${req.url.replace('/api/proxy', '')}`;

  try {
    const response = await axios.get(backendURL, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Proxy Error' },
      { status: error.response?.status || 500 },
    );
  }
}
