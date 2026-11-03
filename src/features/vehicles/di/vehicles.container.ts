import { sharedContainer } from '@/shared/di/shared.container';
import { makeFindAvailableVehicles } from '../application/use-cases/find-available-vehicles';
import { HttpVehicleRepository } from '../infrastructure/repositories/http-vehicle-repository';
import type { VehiclesUseCases } from '../presentation/hooks/vehicles-context';

/**
 * Composición de la feature: el ÚNICO archivo de vehicles que importa
 * de infrastructure/.
 */
const vehicles = new HttpVehicleRepository(sharedContainer.http);

export const vehiclesContainer: VehiclesUseCases = {
  findAvailableVehicles: makeFindAvailableVehicles({ vehicles }),
};
