'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  async function load() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/checklists/executions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRows(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function completeWithCriticalFailure(id: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/checklists/executions/${id}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ result: 'FAILED', observations: 'Falha crítica simulada', criticalFailure: true }),
    });
    if (res.ok) {
      setMessage('Checklist concluído com falha crítica. Incidente aberto automaticamente.');
      await load();
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Checklists Operacionais</h3>
      {message && <p className="text-amber-700">{message}</p>}
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left"><th className="py-2">Template</th><th>Status</th><th>Prazo</th><th>Ação</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="py-2">{row.template?.title}</td>
                <td>{row.status}</td>
                <td>{new Date(row.dueDate).toLocaleString()}</td>
                <td>
                  <button className="bg-crit text-white px-2 py-1 rounded text-xs" onClick={() => completeWithCriticalFailure(row.id)}>
                    Simular Falha Crítica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
