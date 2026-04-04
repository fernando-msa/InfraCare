'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Shell } from '@/components/shell';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;
  return <Shell>{children}</Shell>;
}
