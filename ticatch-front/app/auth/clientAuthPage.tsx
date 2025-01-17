'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginWithKakao } from '@features/auth/hooks';

interface ClientAuthPageProps {
  code: string;
}

const ClientAuthPage = ({ code }: ClientAuthPageProps) => {
  const router = useRouter();
  const { mutate: loginWithKakao } = useLoginWithKakao();

  useEffect(() => {
    loginWithKakao(code, {
      onSuccess: () => router.push('/'),
      onError: () => router.push('/login'),
    });
  }, [code, loginWithKakao, router]);

  return <div>로그인 중...</div>;
};

export default ClientAuthPage;
