'use client';
import { useEffect, useMemo, useState } from 'react';

function Badge({ value }: { value: string }) {
  const color =
    value.includes('OFFLINE') || value.includes('CRITICAL') || value.includes('ESCALATED')
      ? 'bg-red-100 text-red-700'
      : value.includes('UNSTABLE') || value.includes('PENDING')
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-green-100 text-green-700';
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{value}</span>;
}

export function ModulePage({ title, endpoint }: { title: string; endpoint: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, { headers })
      .then(async (r) => {
        if (!r.ok) throw new Error('Falha ao carregar módulo');
        return r.json();
      })
      .then((json) => { setData(json); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [endpoint]);

  const rows = useMemo(() => (Array.isArray(data) ? data : data ? [data] : []), [data]);
  const columns = useMemo(() => {
    if (!rows.length) return [] as string[];
    return Object.keys(rows[0]).filter((k) => !['passwordHash'].includes(k)).slice(0, 6);
  }, [rows]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {error && <p className="text-crit">{error}</p>}

      {loading ? (
        <div className="card text-sm text-slate-500">Carregando dados...</div>
      ) : !rows.length ? (
        <div className="card text-sm text-slate-500">Nenhum registro encontrado.</div>
      ) : (
        <div className="card overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                {columns.map((col) => (
                  <th key={col} className="py-2 pr-3 font-semibold text-slate-600">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 30).map((row, idx) => (
                <tr key={row.id || idx} className="border-b last:border-0">
                  {columns.map((col) => {
                    const value = row[col];
                    if (typeof value === 'string' && ['status', 'severity', 'currentStatus', 'priority'].includes(col)) {
                      return (
                        <td key={col} className="py-2 pr-3">
                          <Badge value={value} />
                        </td>
                      );
                    }
                    return (
                      <td key={col} className="py-2 pr-3 text-slate-700">
                        {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '-')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
