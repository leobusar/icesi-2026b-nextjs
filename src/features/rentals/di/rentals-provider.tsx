'use client';
import { RentalsContext } from '../presentation/hooks/rentals-context';
import { rentalsContainer } from './rentals.container';

/** Entrega los casos de uso reales a los hooks de la feature. */
export function RentalsProvider({ children }: { children: React.ReactNode }) {
  return <RentalsContext.Provider value={rentalsContainer}>{children}</RentalsContext.Provider>;
}
