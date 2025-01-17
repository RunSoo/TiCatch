import { redirect } from 'next/navigation';
import ClientAuthPage from './clientAuthPage';

interface AuthPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const code = params?.code;

  if (!code) {
    redirect('/login');
  }

  return <ClientAuthPage code={code} />;
}
