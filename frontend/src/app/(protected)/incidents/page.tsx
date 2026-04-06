import { CrudPage } from '@/components/crud-page';

export default function Page() {
  return (
    <CrudPage
      title="Incidentes"
      endpoint="/incidents"
      fields={[
        { name: 'title', label: 'Título' },
        { name: 'description', label: 'Descrição' },
        { name: 'type', label: 'Tipo' },
        { name: 'severity', label: 'Severidade', placeholder: 'HIGH' },
        { name: 'impact', label: 'Impacto' },
        { name: 'origin', label: 'Origem' },
        { name: 'unitId', label: 'Unit ID' },
        { name: 'sectorId', label: 'Sector ID' },
      ]}
    />
  );
}
