'use client';
import { createContext, useContext } from 'react';
import type { CancelRental } from '../../application/use-cases/cancel-rental';
import type { ListMyRentals } from '../../application/use-cases/list-my-rentals';

/** Los casos de uso que la presentación de rentals puede usar. */
export interface RentalsUseCases {
  listMyRentals: ListMyRentals;
  cancelRental: CancelRental;
}

/**
 * El Context solo declara QUÉ se necesita. Quién lo llena con las
 * implementaciones reales es di/rentals-provider.tsx; en un test,
 * se puede llenar con casos de uso falsos.
 */
export const RentalsContext = createContext<RentalsUseCases | null>(null);

export function useRentalsUseCases(): RentalsUseCases {
  const useCases = useContext(RentalsContext);
  if (!useCases) {
    throw new Error('useRentalsUseCases debe usarse dentro de <RentalsProvider>');
  }
  return useCases;
}
