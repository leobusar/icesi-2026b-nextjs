import type { Clock } from '@/shared/domain/clock';
import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { Rental } from '../../domain/entities/rental';
import { validateNewRental } from '../../domain/rules/booking';
import { STANDARD_BOOKING, type BookingPolicy } from '../../domain/value-objects/booking-policy';
import type { RentalRepository } from '../repositories/rental-repository';

export type CreateRental = (params: { vehicleId: number; period: DateRange }) => Promise<Rental>;

interface Deps {
  rentals: RentalRepository;
  clock: Clock;
  bookingPolicy?: BookingPolicy;
}

/**
 * Caso de uso: crear una reserva nueva.
 * Vuelve a validar con la hora actual (no la de cuando el cliente abrió
 * el formulario, puede haber tardado en confirmar) antes de llamar al
 * repositorio. El servidor también valida, y además decide si el carro
 * sigue libre en esas fechas.
 */
export function makeCreateRental({ rentals, clock, bookingPolicy = STANDARD_BOOKING }: Deps): CreateRental {
  return async ({ vehicleId, period }) => {
    validateNewRental(period, clock.now(), bookingPolicy);
    return rentals.create({ vehicleId, period });
  };
}
