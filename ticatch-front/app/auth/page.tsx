import { redirect } from 'next/navigation';

interface AuthPageProps {
  searchParams: { code?: string };
}

export default function AuthPage({ searchParams }: AuthPageProps) {
  const code = searchParams?.code;

  if (!code) {
    redirect('/login'); // 로그인 페이지로 리다이렉트
  }

  return (
    <div>
      <p>로그인 중...</p>
    </div>
  );
}
