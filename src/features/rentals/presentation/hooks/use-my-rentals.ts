'use client';
import { useEffect, useState } from 'react';
import { UnauthenticatedError } from '@/shared/application/errors/application-errors';
import type { RentalSummary } from '../../application/use-cases/list-my-rentals';
import { messageFor } from '../view-models/error-messages';
import { toRentalViewModel, type RentalViewModel } from '../view-models/rental-view-model';
import { useRentalsUseCases } from './rentals-context';

type State =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'error'; message: string }
  | { status: 'ready'; summaries: RentalSummary[] };

/**
 * Conecta los casos de uso con el estado de React.
 * El componente solo recibe view models y funciones; no sabe de casos de uso.
 */
export function useMyRentals() {
  const { listMyRentals, cancelRental } = useRentalsUseCases();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [actionError, setActionError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true; // evita actualizar el estado si el componente se desmontó
    listMyRentals()
      .then((summaries) => {
        if (active) setState({ status: 'ready', summaries });
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof UnauthenticatedError) setState({ status: 'unauthenticated' });
        else setState({ status: 'error', message: messageFor(error) });
      });
    return () => {
      active = false;
    };
  }, [listMyRentals]);

  const cancel = async (rentalId: number) => {
    if (state.status !== 'ready') return;
    const summary = state.summaries.find((s) => s.rental.id === rentalId);
    if (!summary) return;

    setActionError(null);
    setCancellingId(rentalId);
    try {
      await cancelRental(summary.rental);
      // Solo se quita de la lista si el servidor confirmó la cancelación.
      setState({ status: 'ready', summaries: state.summaries.filter((s) => s.rental.id !== rentalId) });
    } catch (error) {
      setActionError(messageFor(error));
    } finally {
      setCancellingId(null);
    }
  };

  const rentals: RentalViewModel[] = state.status === 'ready' ? state.summaries.map(toRentalViewModel) : [];

  return { state, rentals, cancel, cancellingId, actionError };
}
