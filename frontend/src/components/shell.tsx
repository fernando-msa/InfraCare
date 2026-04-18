'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
	{ href: '/dashboard', label: 'Dashboard' },
	{ href: '/assets', label: 'Ativos' },
	{ href: '/incidents', label: 'Incidentes' },
	{ href: '/tickets', label: 'Chamados' },
	{ href: '/checklists', label: 'Checklists' },
	{ href: '/sla', label: 'SLA' },
	{ href: '/status', label: 'Status' },
	{ href: '/reports', label: 'Relatórios' },
	{ href: '/audit', label: 'Auditoria' },
	{ href: '/users', label: 'Usuários' },
];

export function Shell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	function logout() {
		localStorage.removeItem('token');
		router.replace('/login');
	}

	return (
		<div className="min-h-screen xl:grid xl:grid-cols-[280px_1fr]">
			<aside className="border-b border-slate-200/70 bg-white/90 px-5 py-6 backdrop-blur xl:sticky xl:top-0 xl:h-screen xl:border-b-0 xl:border-r">
				<div className="space-y-6">
					<div>
						<p className="eyebrow text-slate-500">Hospital operations</p>
						<h1 className="mt-2 text-2xl font-semibold text-slate-950">InfraCare</h1>
						<p className="mt-2 text-sm text-slate-500">Painel de comando para operação, auditoria e suporte.</p>
					</div>

					<nav className="grid gap-1">
						{NAV_ITEMS.map((item) => {
							const active = pathname === item.href;
							return (
								<Link key={item.href} href={item.href} className={`nav-link ${active ? 'nav-link-active' : ''}`}>
									{item.label}
								</Link>
							);
						})}
					</nav>

					<button type="button" onClick={logout} className="btn-secondary w-full">
						Encerrar sessão
					</button>
				</div>
			</aside>

			<main className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
				<div className="ambient ambient-a" />
				<div className="ambient ambient-b" />
				<div className="mx-auto max-w-7xl space-y-6">{children}</div>
			</main>
		</div>
	);
}
