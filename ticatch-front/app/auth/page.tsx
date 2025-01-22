'use client';

import { loginWithKakao } from 'api';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export const dynamic = 'force-dynamic';

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLogin = async () => {
      const code = searchParams.get('code') ?? '';
      try {
        await loginWithKakao(code);
        router.push('/');
      } catch (error) {
        console.log('로그인 실패: ', error);
        router.push('/login');
      }
    };
    handleLogin();
  }, [router, searchParams]);

  // TODO: 로딩 스피너 도입
  return <div>로그인 중</div>;
};

export default AuthPage;
