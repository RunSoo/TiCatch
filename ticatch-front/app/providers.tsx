'use client';

import {
  QueryClient,
  QueryClientProvider,
  hydrate,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Providers({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: any;
}) {
  if (dehydratedState) {
    hydrate(queryClient, dehydratedState);
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
