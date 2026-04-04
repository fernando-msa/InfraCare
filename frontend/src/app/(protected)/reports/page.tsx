'use client';
import { useState } from 'react';
import { ModulePage } from '@/components/module-page';

export default function Page() {
  const [loading, setLoading] = useState('');

  async function exportCsv(type: 'incidents' | 'tickets' | 'checklists') {
    setLoading(type);
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reports/export?type=${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading('');
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap gap-2">
        <button onClick={() => exportCsv('incidents')} className="bg-info text-white px-3 py-2 rounded">
          {loading === 'incidents' ? 'Exportando...' : 'Exportar Incidentes CSV'}
        </button>
        <button onClick={() => exportCsv('tickets')} className="bg-slate-700 text-white px-3 py-2 rounded">
          {loading === 'tickets' ? 'Exportando...' : 'Exportar Chamados CSV'}
        </button>
        <button onClick={() => exportCsv('checklists')} className="bg-slate-500 text-white px-3 py-2 rounded">
          {loading === 'checklists' ? 'Exportando...' : 'Exportar Checklists CSV'}
        </button>
      </div>
      <ModulePage title="Relatórios" endpoint="/reports" />
    </div>
  );
}
