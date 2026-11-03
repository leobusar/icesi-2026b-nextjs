import type { HttpClient } from '@/shared/infrastucture/http-client';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { VehicleRepository } from '../../application/repositories/vehicle-repository';
import type { Vehicle } from '../../domain/entities/vehicle';
import type { VehicleDto } from '../dtos/vehicle.dto';
import { toVehicle } from '../mappers/vehicle.mapper';

/** Implementación del puerto VehicleRepository contra la API REST. */
export class HttpVehicleRepository implements VehicleRepository {
  constructor(private readonly http: HttpClient) {}

  async findAvailable(period: DateRange): Promise<Vehicle[]> {
    const from = encodeURIComponent(period.start.toISOString());
    const to = encodeURIComponent(period.end.toISOString());
    const dtos = await this.http.get<VehicleDto[]>(`/vehicles?from=${from}&to=${to}`);
    return dtos.map(toVehicle);
  }
}
