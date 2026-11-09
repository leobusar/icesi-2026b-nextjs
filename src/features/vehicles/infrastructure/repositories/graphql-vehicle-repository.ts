import type { GraphQLHttpClient } from '@/shared/infrastucture/graphql-client';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { VehicleRepository } from '../../application/repositories/vehicle-repository';
import type { Vehicle } from '../../domain/entities/vehicle';
import type { VehicleDto } from '../dtos/vehicle.dto';
import { toVehicle } from '../mappers/vehicle.mapper';

const AVAILABLE_VEHICLES_QUERY = `
  query AvailableVehicles($from: String!, $to: String!) {
    availableVehicles(from: $from, to: $to) {
      id
      plate
      brand
      model
      year
      category
      dailyRate
    }
  }
`;

interface AvailableVehiclesResponse {
  availableVehicles: VehicleDto[];
}

/** Implementación del puerto VehicleRepository contra el endpoint GraphQL. */
export class GraphQLVehicleRepository implements VehicleRepository {
  constructor(private readonly graphql: GraphQLHttpClient) {}

  async findAvailable(period: DateRange): Promise<Vehicle[]> {
    const { availableVehicles } = await this.graphql.request<AvailableVehiclesResponse>(AVAILABLE_VEHICLES_QUERY, {
      from: period.start.toISOString(),
      to: period.end.toISOString(),
    });
    return availableVehicles.map(toVehicle);
  }
}
