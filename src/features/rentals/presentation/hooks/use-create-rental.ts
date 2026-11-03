'use client';
import { useState } from 'react';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import { messageFor } from '../view-models/error-messages';
import { useRentalsUseCases } from './rentals-context';

/** Conecta el caso de uso createRental con el estado de React. */
export function useCreateRental() {
  const { createRental } = useRentalsUseCases();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (params: { vehicleId: number; period: DateRange }): Promise<boolean> => {
    setCreating(true);
    setError(null);
    try {
      await createRental(params);
      return true;
    } catch (cause) {
      setError(messageFor(cause));
      return false;
    } finally {
      setCreating(false);
    }
  };

  return { create, creating, error };
}
