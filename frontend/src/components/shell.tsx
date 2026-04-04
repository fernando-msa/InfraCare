'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  ['Dashboard', '/dashboard'], ['Ativos', '/assets'], ['Incidentes', '/incidents'], ['Checklists', '/checklists'], ['Chamados', '/tickets'], ['SLA', '/sla'], ['Auditoria', '/audit'], ['Relatórios', '/reports'], ['Status', '/status'], ['Usuários', '/users'],
];

export function Shell({ children }: { children: ReactNode }) {
  const p = usePathname();
  return <div className="min-h-screen flex"><aside className="w-64 bg-slate-900 text-white p-4"><h1 className="text-xl font-bold mb-6">InfraCare</h1><nav className="space-y-1">{items.map(([label, href]) => <Link key={href} href={href} className={`block px-3 py-2 rounded ${p===href?'bg-slate-700':'hover:bg-slate-800'}`}>{label}</Link>)}</nav></aside><main className="flex-1 p-6"><header className="mb-6"><h2 className="text-2xl font-semibold">Operação de Infraestrutura Hospitalar</h2></header>{children}</main></div>;
}
