'use client';
import { VehiclesContext } from '../presentation/hooks/vehicles-context';
import { vehiclesContainer } from './vehicles.container';

/** Entrega los casos de uso reales a los hooks de la feature. */
export function VehiclesProvider({ children }: { children: React.ReactNode }) {
  return <VehiclesContext.Provider value={vehiclesContainer}>{children}</VehiclesContext.Provider>;
}
