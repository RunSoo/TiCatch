import React from 'react';

const LoginPage = () => {
  const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID as string;
  const KAKAO_REDIRECT_URI = process.env
    .NEXT_PUBLIC_KAKAO_REDIRECT_URI as string;

  const KAKAO_AUTH_URL = `http://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;
  return (
    <div>
      <h1>로그인 페이지</h1>
      <a href={KAKAO_AUTH_URL}>로그인 ~</a>
    </div>
  );
};

export default LoginPage;
