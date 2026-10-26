import type { Clock } from '@/shared/domain/clock';
import type { Rental } from '../../domain/entities/rental';
import { CancellationNotAllowedError } from '../../domain/errors/rental-errors';
import { canCancel } from '../../domain/rules/cancellation';
import { STANDARD_CANCELLATION, type CancellationPolicy } from '../../domain/value-objects/cancellation-policy';
import type { RentalRepository } from '../repositories/rental-repository';

export type CancelRental = (rental: Rental) => Promise<void>;

interface Deps {
  rentals: RentalRepository;
  clock: Clock;
  cancellationPolicy?: CancellationPolicy;
}

/**
 * Caso de uso: cancelar un alquiler.
 * Valida la regla antes de llamar al servidor (el servidor también la valida).
 * Si algo falla, lanza el error: quien llama decide qué mostrar,
 * y el alquiler NO se da por cancelado.
 */
export function makeCancelRental({
  rentals,
  clock,
  cancellationPolicy = STANDARD_CANCELLATION,
}: Deps): CancelRental {
  return async (rental) => {
    if (!canCancel(rental, clock.now(), cancellationPolicy)) {
      throw new CancellationNotAllowedError(rental.id);
    }
    await rentals.cancel(rental.id);
  };
}