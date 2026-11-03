'use client';
import { useEffect, useState } from 'react';
import { ServiceUnavailableError, UnauthenticatedError } from '@/shared/application/errors/application-errors';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { Vehicle } from '../../domain/entities/vehicle';
import { useVehiclesUseCases } from './vehicles-context';

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; vehicles: Vehicle[] };

function messageFor(error: unknown): string {
  if (error instanceof UnauthenticatedError) return 'Tu sesión expiró. Vuelve a ingresar.';
  if (error instanceof ServiceUnavailableError) return 'No pudimos conectarnos. Intenta de nuevo en unos minutos.';
  return 'No pudimos cargar los vehículos disponibles.';
}

/** Busca los vehículos disponibles en el periodo dado y los recarga si cambia. */
export function useAvailableVehicles(period: DateRange) {
  const { findAvailableVehicles } = useVehiclesUseCases();
  const [state, setState] = useState<State>({ status: 'loading' });

  // period es un objeto nuevo en cada render; se compara por sus instantes
  // (no por referencia) para no repetir la búsqueda si las fechas no cambiaron.
  const start = period.start.getTime();
  const end = period.end.getTime();

  useEffect(() => {
    let active = true;
    findAvailableVehicles(period)
      .then((vehicles) => {
        if (active) setState({ status: 'ready', vehicles });
      })
      .catch((error: unknown) => {
        if (active) setState({ status: 'error', message: messageFor(error) });
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, findAvailableVehicles]);

  return state;
}
