'use client';
import { useEffect, useState } from 'react';

export function ModulePage({ title, endpoint }: { title: string; endpoint: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${endpoint}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Falha ao carregar dados'));
  }, [endpoint]);

  return <div className="space-y-4"><h3 className="text-xl font-semibold">{title}</h3>{error && <p className="text-crit">{error}</p>}<div className="card"><pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre></div></div>;
}
