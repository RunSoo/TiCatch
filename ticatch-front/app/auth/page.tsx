'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLoginWithKakao } from '@features/auth/hooks';

interface AuthPageProps {
  searchParams: { code?: string };
}

export default function AuthPage({ searchParams }: AuthPageProps) {
  const router = useRouter();
  const { mutate: loginWithKakao } = useLoginWithKakao();
  const code = searchParams?.code;

  useEffect(() => {
    if (!code) {
      router.push('/login');
      return;
    }

    loginWithKakao(code, {
      onSuccess: () => router.push('/'),
      onError: () => router.push('/login'),
    });
  }, [code, loginWithKakao, router]);

  return <div>로그인 중...</div>;
}
