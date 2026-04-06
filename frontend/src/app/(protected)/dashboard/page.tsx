'use client';
import { useEffect, useState } from 'react';

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs"><span>{label}</span><span>{value}</span></div>
      <div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-info" style={{ width: `${Math.min(100, value * 10)}%` }} /></div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData);
  }, []);

  const metrics = data?.metrics || {};
  const cards = [
    ['Ativos totais', metrics.totalAssets],
    ['Ativos online', metrics.onlineAssets],
    ['Ativos offline', metrics.offlineAssets],
    ['Incidentes abertos', metrics.openIncidents],
    ['Incidentes críticos', metrics.criticalIncidents],
    ['Chamados abertos', metrics.openTickets],
    ['Fora SLA', metrics.lateTickets],
    ['Checklists pendentes', metrics.pendingChecklists],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(([label, value]) => (
          <div key={String(label)} className="card">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold">{value ?? '-'}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="card space-y-2">
          <h4 className="font-semibold">Incidentes por severidade</h4>
          {(data?.charts?.incidentsBySeverity || []).map((i: any) => <MiniBar key={i.severity} label={i.severity} value={i._count} />)}
        </div>
        <div className="card space-y-2">
          <h4 className="font-semibold">Chamados por status</h4>
          {(data?.charts?.ticketsByStatus || []).map((t: any) => <MiniBar key={t.status} label={t.status} value={t._count} />)}
        </div>
        <div className="card space-y-2">
          <h4 className="font-semibold">SLA por setor</h4>
          {(data?.charts?.slaBySector || []).map((s: any, idx: number) => <MiniBar key={idx} label={s.sector} value={s.total} />)}
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        <div className="card">
          <h4 className="font-semibold mb-3">Alertas recentes</h4>
          <ul className="space-y-2">
            {(data?.alerts || []).map((a: any) => (
              <li key={a.id} className="text-sm">{a.name} - <span className="font-semibold">{a.currentStatus}</span></li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h4 className="font-semibold mb-3">Últimos incidentes</h4>
          <ul className="space-y-2">
            {(data?.incidents || []).map((i: any) => (
              <li key={i.id} className="text-sm">{i.title} - {i.severity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
