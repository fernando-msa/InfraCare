'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (localStorage.getItem('token')) {
			router.replace('/dashboard');
		}
	}, [router]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				throw new ApiError(response.status, 'Credenciais inválidas');
			}

			const payload = (await response.json()) as { accessToken: string };
			localStorage.setItem('token', payload.accessToken);
			router.replace('/dashboard');
		} catch (cause) {
			setError(cause instanceof ApiError ? cause.message : 'Falha ao autenticar');
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
			<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				<section className="hero-panel flex flex-col justify-between rounded-[2rem] p-8 shadow-2xl shadow-slate-950/30">
					<div className="space-y-6">
						<span className="eyebrow text-white/70">InfraCare</span>
						<h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">Controle hospitalar com leitura rápida e auditoria clara.</h1>
						<p className="max-w-xl text-base text-slate-200/90 md:text-lg">
							Painel local para acompanhar ativos, incidentes, tickets, SLA e status operacional sem depender de credenciais pré-preenchidas.
						</p>
					</div>

					<div className="mt-8 grid gap-3 sm:grid-cols-3">
						{[
							['Confiabilidade', 'CORS restrito e JWT obrigatório'],
							['Operação', 'Painel, status e auditoria'],
							['Evidência', 'Testes locais documentados no README'],
						].map(([title, value]) => (
							<div key={title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
								<p className="text-xs uppercase tracking-[0.25em] text-white/60">{title}</p>
								<p className="mt-2 text-sm text-white/90">{value}</p>
							</div>
						))}
					</div>
				</section>

				<section className="card flex items-center">
					<div className="w-full space-y-6">
						<div>
							<p className="eyebrow text-slate-500">Acesso seguro</p>
							<h2 className="mt-2 text-2xl font-semibold text-slate-950">Entre com a conta de demonstração</h2>
							<p className="mt-2 text-sm text-slate-500">As credenciais ficam documentadas no README e não são inseridas automaticamente.</p>
						</div>

						<form className="space-y-4" onSubmit={submit}>
							<label className="block space-y-2 text-sm">
								<span className="font-medium text-slate-700">E-mail</span>
								<input
									type="email"
									className="input-field"
									placeholder="admin@infracare.local"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									autoComplete="email"
									required
								/>
							</label>

							<label className="block space-y-2 text-sm">
								<span className="font-medium text-slate-700">Senha</span>
								<input
									type="password"
									className="input-field"
									placeholder="Digite sua senha"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									autoComplete="current-password"
									required
								/>
							</label>

							{error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">{error}</p>}

							<button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
								{loading ? 'Autenticando...' : 'Entrar'}
							</button>
						</form>

						<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
							<p className="font-medium text-slate-900">Conta de demo</p>
							<p className="mt-1">admin@infracare.local / Admin@123</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
