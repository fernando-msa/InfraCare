'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const items = [
  ['Dashboard', '/dashboard'], ['Ativos', '/assets'], ['Incidentes', '/incidents'], ['Checklists', '/checklists'], ['Chamados', '/tickets'], ['SLA', '/sla'], ['Auditoria', '/audit'], ['Relatórios', '/reports'], ['Status', '/status'], ['Usuários', '/users'],
];

export function Shell({ children }: { children: React.ReactNode }) {
  const p = usePathname();
  const router = useRouter();

  async function logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  }

  return <div className="min-h-screen flex"><aside className="w-64 bg-slate-900 text-white p-4"><h1 className="text-xl font-bold mb-6">InfraCare</h1><nav className="space-y-1">{items.map(([label, href]) => <Link key={href} href={href} className={`block px-3 py-2 rounded ${p===href?'bg-slate-700':'hover:bg-slate-800'}`}>{label}</Link>)}</nav><button onClick={logout} className="mt-6 w-full rounded bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600">Sair</button></aside><main className="flex-1 p-6"><header className="mb-6"><h2 className="text-2xl font-semibold">Operação de Infraestrutura Hospitalar</h2></header>{children}</main></div>;
}
