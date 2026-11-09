import { sharedContainer } from '@/shared/di/shared.container';
import { makeFindAvailableVehicles } from '../application/use-cases/find-available-vehicles';
import { GraphQLVehicleRepository } from '../infrastructure/repositories/graphql-vehicle-repository';
import type { VehiclesUseCases } from '../presentation/hooks/vehicles-context';

/**
 * Composición de la feature: el ÚNICO archivo de vehicles que importa
 * de infrastructure/. GraphQLVehicleRepository implementa el mismo puerto
 * VehicleRepository que antes implementaba HttpVehicleRepository (REST):
 * cambiar de transporte fue cambiar esta línea, nada más.
 */
const vehicles = new GraphQLVehicleRepository(sharedContainer.graphql);

export const vehiclesContainer: VehiclesUseCases = {
  findAvailableVehicles: makeFindAvailableVehicles({ vehicles }),
};
