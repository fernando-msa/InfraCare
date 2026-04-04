'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then(setData);
  }, []);
  const metrics = data?.metrics || {};
  const cards = [
    ['Ativos totais', metrics.totalAssets], ['Ativos online', metrics.onlineAssets], ['Ativos offline', metrics.offlineAssets], ['Incidentes abertos', metrics.openIncidents], ['Incidentes críticos', metrics.criticalIncidents], ['Chamados abertos', metrics.openTickets], ['Fora SLA', metrics.lateTickets], ['Checklists pendentes', metrics.pendingChecklists],
  ];
  return <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(([label, value]) => <div key={String(label)} className="card"><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{value ?? '-'}</p></div>)}</div><div className="grid xl:grid-cols-2 gap-4"><div className="card"><h4 className="font-semibold mb-3">Alertas recentes</h4><ul className="space-y-2">{(data?.alerts||[]).map((a:any)=><li key={a.id} className="text-sm">{a.name} - <span className="font-semibold">{a.currentStatus}</span></li>)}</ul></div><div className="card"><h4 className="font-semibold mb-3">Últimos incidentes</h4><ul className="space-y-2">{(data?.incidents||[]).map((i:any)=><li key={i.id} className="text-sm">{i.title} - {i.severity}</li>)}</ul></div></div></div>;
}
