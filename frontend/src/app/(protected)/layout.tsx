'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/shell';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => { if (!localStorage.getItem('token')) router.push('/login'); }, [router]);
  return <Shell>{children}</Shell>;
}
