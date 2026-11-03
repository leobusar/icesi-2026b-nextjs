'use client';
import { createContext, useContext } from 'react';
import type { FindAvailableVehicles } from '../../application/use-cases/find-available-vehicles';

/** Los casos de uso que la presentación de vehicles puede usar. */
export interface VehiclesUseCases {
  findAvailableVehicles: FindAvailableVehicles;
}

export const VehiclesContext = createContext<VehiclesUseCases | null>(null);

export function useVehiclesUseCases(): VehiclesUseCases {
  const useCases = useContext(VehiclesContext);
  if (!useCases) {
    throw new Error('useVehiclesUseCases debe usarse dentro de <VehiclesProvider>');
  }
  return useCases;
}
