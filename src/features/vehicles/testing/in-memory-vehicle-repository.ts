import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { VehicleRepository } from '../application/repositories/vehicle-repository';
import type { Vehicle } from '../domain/entities/vehicle';

/** Implementación falsa del puerto, en memoria, para pruebas. */
export class InMemoryVehicleRepository implements VehicleRepository {
  lastPeriod?: DateRange;

  constructor(private vehicles: Vehicle[] = []) {}

  async findAvailable(period: DateRange): Promise<Vehicle[]> {
    this.lastPeriod = period;
    return [...this.vehicles];
  }
}
