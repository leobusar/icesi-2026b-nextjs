import { formatCOP } from '@/shared/ui/format-cop';
import type { Vehicle } from '../../domain/entities/vehicle';

/** Todo en texto, listo para pintar en la tarjeta de un vehículo. */
export interface VehicleViewModel {
  id: number;
  title: string;
  plateLabel: string;
  category: string;
  dailyRateLabel: string;
}

export function toVehicleViewModel(vehicle: Vehicle): VehicleViewModel {
  return {
    id: vehicle.id,
    title: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
    plateLabel: vehicle.plate.toString(),
    category: vehicle.category,
    dailyRateLabel: `${formatCOP(vehicle.dailyRate)}/día`,
  };
}
