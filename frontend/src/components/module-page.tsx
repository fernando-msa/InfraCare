'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, api } from '@/lib/api';

type Row = {
	id: string;
	name?: string;
	title?: string;
	status?: string;
	summary?: string;
	description?: string;
	details?: string;
	updatedAt?: string;
};

function normalizeRows(payload: unknown): Row[] {
	if (Array.isArray(payload)) return payload as Row[];
	if (payload && typeof payload === 'object') {
		const data = payload as { cards?: Row[]; highlights?: Row[]; items?: Row[] };
		return [...(data.cards || []), ...(data.highlights || []), ...(data.items || [])];
	}
	return [];
}

function tone(status?: string) {
	const normalized = String(status || '').toUpperCase();
	if (normalized === 'CRITICAL' || normalized === 'BLOCKED') return 'bg-rose-500/15 text-rose-200 border-rose-500/30';
	if (normalized === 'WARN') return 'bg-amber-500/15 text-amber-100 border-amber-500/30';
	if (normalized === 'OK') return 'bg-emerald-500/15 text-emerald-100 border-emerald-500/30';
	return 'bg-sky-500/15 text-sky-100 border-sky-500/30';
}

function prettyDate(value?: string) {
	if (!value) return '-';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function ModulePage({ title, endpoint, description }: { title: string; endpoint: string; description?: string }) {
	const router = useRouter();
	const [rows, setRows] = useState<Row[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let alive = true;

		async function load() {
			try {
				setLoading(true);
				setError('');
				const token = localStorage.getItem('token') || undefined;
				const payload = await api<unknown>(endpoint, token);
				if (!alive) return;
				setRows(normalizeRows(payload));
			} catch (cause) {
				if (cause instanceof ApiError && cause.status === 401) {
					router.replace('/login');
					return;
				}

				if (alive) setError('Não foi possível carregar este módulo no momento.');
			} finally {
				if (alive) setLoading(false);
			}
		}

		load();

		return () => {
			alive = false;
		};
	}, [endpoint, router]);

	const stats = useMemo(() => {
		const critical = rows.filter((row) => String(row.status).toUpperCase() === 'CRITICAL').length;
		const warning = rows.filter((row) => String(row.status).toUpperCase() === 'WARN').length;
		const healthy = rows.filter((row) => String(row.status).toUpperCase() === 'OK').length;

		return [
			{ label: 'Registros', value: String(rows.length).padStart(2, '0') },
			{ label: 'Saudáveis', value: String(healthy).padStart(2, '0') },
			{ label: 'Em atenção', value: String(warning + critical).padStart(2, '0') },
		];
	}, [rows]);

	return (
		<div className="space-y-6">
			<section className="hero-panel rounded-[2rem] p-6 md:p-8 text-white shadow-2xl shadow-slate-950/20">
				<div className="max-w-3xl space-y-4">
					<span className="eyebrow">InfraCare operacional</span>
					<h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
					<p className="max-w-2xl text-slate-200/90">
						{description || 'Visão consolidada para acompanhamento de operação, auditoria e resposta rápida.'}
					</p>
				</div>

				<div className="mt-8 grid gap-3 sm:grid-cols-3">
					{stats.map((stat) => (
						<div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
							<p className="text-xs uppercase tracking-[0.25em] text-slate-200/80">{stat.label}</p>
							<p className="mt-2 text-2xl font-semibold">{stat.value}</p>
						</div>
					))}
				</div>
			</section>

			{error && <div className="card border-rose-500/30 bg-rose-500/5 text-rose-100">{error}</div>}

			<section className="card">
				<div className="mb-4 flex items-center justify-between gap-3">
					<div>
						<h2 className="text-xl font-semibold text-slate-900">{title}</h2>
						<p className="text-sm text-slate-500">Fonte: {endpoint}</p>
					</div>
					{loading && <span className="badge badge-info">Carregando</span>}
				</div>

				<div className="overflow-auto rounded-2xl border border-slate-200">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50 text-left text-slate-500">
							<tr>
								<th className="px-4 py-3 font-medium">Registro</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium">Resumo</th>
								<th className="px-4 py-3 font-medium">Atualizado</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{rows.slice(0, 12).map((row) => (
								<tr key={row.id} className="hover:bg-slate-50/80">
									<td className="px-4 py-3">
										<p className="font-medium text-slate-900">{row.name || row.title || row.id}</p>
										<p className="text-xs text-slate-500">{row.details || row.description || row.id}</p>
									</td>
									<td className="px-4 py-3">
										<span className={`badge ${tone(row.status)}`}>{row.status || 'INFO'}</span>
									</td>
									<td className="px-4 py-3 text-slate-600">{row.summary || row.details || '-'}</td>
									<td className="px-4 py-3 text-slate-500">{prettyDate(row.updatedAt)}</td>
								</tr>
							))}
							{!loading && rows.length === 0 && (
								<tr>
									<td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
										Nenhum dado encontrado para este módulo.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
