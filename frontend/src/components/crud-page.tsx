'use client';
import { FormEvent, useEffect, useState } from 'react';
import { ApiError } from '@/lib/api';

type Field = { name: string; label: string; placeholder?: string };

export function CrudPage({ title, endpoint, fields }: { title: string; endpoint: string; fields: Field[] }) {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  async function load() {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, { headers });
    if (!res.ok) {
      throw new ApiError(res.status, 'Falha ao carregar dados');
    }
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    load().catch(() => setError('Falha ao carregar dados'));
  }, [endpoint]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError('Não foi possível salvar. Verifique os campos obrigatórios.');
      return;
    }
    setForm({});
    await load();
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <form onSubmit={submit} className="card grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {fields.map((f) => (
          <label key={f.name} className="text-sm">
            <span className="block mb-1 text-slate-600">{f.label}</span>
            <input
              className="w-full border rounded px-3 py-2"
              value={form[f.name] || ''}
              placeholder={f.placeholder}
              onChange={(e) => setForm((old) => ({ ...old, [f.name]: e.target.value }))}
            />
          </label>
        ))}
        <div className="md:col-span-2 xl:col-span-3">
          <button className="bg-info text-white px-4 py-2 rounded">Salvar</button>
        </div>
        {error && <p className="text-crit md:col-span-2 xl:col-span-3">{error}</p>}
      </form>

      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="py-2">ID</th><th>Título/Nome</th><th>Status</th></tr></thead>
          <tbody>
            {rows.slice(0, 20).map((row) => (
              <tr key={row.id} className="border-b"><td className="py-2 pr-2">{row.id}</td><td>{row.name || row.title || row.number}</td><td>{row.currentStatus || row.status || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
