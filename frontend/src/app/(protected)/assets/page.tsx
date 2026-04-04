import { CrudPage } from '@/components/crud-page';

export default function Page() {
  return (
    <CrudPage
      title="Ativos Monitorados"
      endpoint="/assets"
      fields={[
        { name: 'name', label: 'Nome' },
        { name: 'type', label: 'Tipo' },
        { name: 'category', label: 'Categoria' },
        { name: 'hostname', label: 'Hostname' },
        { name: 'ip', label: 'IP' },
        { name: 'location', label: 'Localização' },
        { name: 'unitId', label: 'Unit ID' },
        { name: 'sectorId', label: 'Sector ID' },
        { name: 'currentStatus', label: 'Status', placeholder: 'ONLINE' },
        { name: 'criticality', label: 'Criticidade', placeholder: 'MEDIUM' },
        { name: 'monitoringMethod', label: 'Método', placeholder: 'mock-health-check' },
        { name: 'checkIntervalMin', label: 'Intervalo (min)', placeholder: '5' },
      ]}
    />
  );
}
