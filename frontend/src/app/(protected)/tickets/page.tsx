import { CrudPage } from '@/components/crud-page';

export default function Page() {
  return (
    <CrudPage
      title="Chamados"
      endpoint="/tickets"
      fields={[
        { name: 'number', label: 'Número' },
        { name: 'title', label: 'Título' },
        { name: 'description', label: 'Descrição' },
        { name: 'requester', label: 'Solicitante' },
        { name: 'unitId', label: 'Unit ID' },
        { name: 'sectorId', label: 'Sector ID' },
        { name: 'category', label: 'Categoria' },
        { name: 'priority', label: 'Prioridade', placeholder: 'MEDIUM' },
        { name: 'slaDeadline', label: 'SLA Deadline', placeholder: '2026-12-31T10:00:00.000Z' },
      ]}
    />
  );
}
