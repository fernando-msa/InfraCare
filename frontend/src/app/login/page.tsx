'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@infracare.local');
  const [password, setPassword] = useState('Infracare@123');
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return setError('Credenciais inválidas');
    const data = await res.json();
    localStorage.setItem('token', data.accessToken);
    router.push('/dashboard');
  }

  return <div className="min-h-screen grid place-items-center"><form onSubmit={onSubmit} className="card w-full max-w-md space-y-4"><h1 className="text-2xl font-semibold">InfraCare Login</h1><input className="w-full border p-2 rounded" value={email} onChange={(e)=>setEmail(e.target.value)} /><input className="w-full border p-2 rounded" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="bg-info text-white px-4 py-2 rounded w-full">Entrar</button>{error && <p className="text-crit">{error}</p>}</form></div>;
}
