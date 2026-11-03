import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { Vehicle } from '../../domain/entities/vehicle';

/**
 * Puerto: lo que la aplicación necesita para buscar vehículos.
 * Implementaciones: infrastructure/repositories/http-vehicle-repository.ts
 * y, en las pruebas, testing/in-memory-vehicle-repository.ts.
 */
export interface VehicleRepository {
  /** Carros sin ningún alquiler que se cruce con el periodo dado. */
  findAvailable(period: DateRange): Promise<Vehicle[]>;
}
