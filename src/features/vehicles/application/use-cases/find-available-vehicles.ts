import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { Vehicle } from '../../domain/entities/vehicle';
import type { VehicleRepository } from '../repositories/vehicle-repository';

export type FindAvailableVehicles = (period: DateRange) => Promise<Vehicle[]>;

interface Deps {
  vehicles: VehicleRepository;
}

/**
 * Caso de uso: buscar los carros disponibles en un periodo.
 * Hoy es un simple paso al repositorio; queda como función aparte porque
 * es el lugar natural para una regla futura (por ejemplo, ordenar por
 * tarifa) sin tocar el componente ni el repositorio.
 */
export function makeFindAvailableVehicles({ vehicles }: Deps): FindAvailableVehicles {
  return (period) => vehicles.findAvailable(period);
}
