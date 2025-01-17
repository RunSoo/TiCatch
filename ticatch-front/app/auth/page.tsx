'use client';

import React, { useEffect } from 'react';
import { useLoginWithKakao } from '@features/auth/hooks';
import { useRouter } from 'next/router';

interface AuthPageProps {
  searchParams: Record<string, string | undefined>;
}

const AuthPage = ({ searchParams }: AuthPageProps) => {
  const { mutate: loginWithKakao } = useLoginWithKakao();
  const router = useRouter();
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
};

export default AuthPage;
