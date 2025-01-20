'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginWithKakao } from '@features/auth/api';

interface ClientAuthPageProps {
  code: string;
}

const ClientAuthPage = ({ code }: ClientAuthPageProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        await loginWithKakao(code);
        router.push('/');
      } catch (error) {
        console.log('로그인 실패: ', error);
        router.push('/login');
      }
    };
    handleLogin();
  }, [code, router]);

  return <div>로그인 중...</div>;
};

export default ClientAuthPage;
