'use client';
import { useEffect, useState } from 'react';

function StatusBadge({ status }: { status: string }) {
  const css =
    status === 'ONLINE'
      ? 'bg-green-100 text-green-700'
      : status === 'UNSTABLE'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700';
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${css}`}>{status}</span>;
}

export default function StatusPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/status-page`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setServices);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Status Interno dos Serviços</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="card space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{service.name}</h4>
              <StatusBadge status={service.status} />
            </div>
            <p className="text-xs text-slate-500">Atualizado em: {new Date(service.updatedAt).toLocaleString()}</p>

            <div>
              <p className="text-xs font-semibold mb-1">Histórico resumido</p>
              <ul className="text-xs space-y-1">
                {service.histories.map((h: any) => (
                  <li key={h.id}>{new Date(h.createdAt).toLocaleDateString()} - {h.status} - {h.summary}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold mb-1">Incidências recentes</p>
              <ul className="text-xs space-y-1">
                {(service.recentIncidents || []).length === 0 && <li className="text-slate-500">Sem incidentes recentes</li>}
                {(service.recentIncidents || []).map((inc: any) => (
                  <li key={inc.id}>{inc.title} ({inc.severity})</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
