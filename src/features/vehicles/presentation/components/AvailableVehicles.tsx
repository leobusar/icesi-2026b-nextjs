'use client';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import { useAvailableVehicles } from '../hooks/use-available-vehicles';
import { toVehicleViewModel } from '../view-models/vehicle-view-model';
import type { Vehicle } from '../../domain/entities/vehicle';
import { VehicleCard } from './VehicleCard';

interface Props {
  period: DateRange;
  onSelect: (vehicle: Vehicle) => void;
}

export function AvailableVehicles({ period, onSelect }: Props) {
  const state = useAvailableVehicles(period);

  if (state.status === 'loading') return <p className="text-zinc-500">Buscando carros disponibles…</p>;
  if (state.status === 'error') return <p className="text-red-700">{state.message}</p>;
  if (state.vehicles.length === 0) return <p className="text-zinc-500">No hay carros disponibles en esas fechas.</p>;

  const byId = new Map(state.vehicles.map((vehicle) => [vehicle.id, vehicle]));
  const selectById = (id: number) => {
    const vehicle = byId.get(id);
    if (vehicle) onSelect(vehicle);
  };

  return (
    <ul className="flex flex-col gap-2">
      {state.vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={toVehicleViewModel(vehicle)} onSelect={selectById} />
      ))}
    </ul>
  );
}
