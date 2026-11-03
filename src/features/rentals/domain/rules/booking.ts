import type { DateRange } from '@/shared/domain/value-objects/date-range';
import { InvalidBookingError } from '../errors/rental-errors';
import { STANDARD_BOOKING, type BookingPolicy } from '../value-objects/booking-policy';

/**
 * Valida que una reserva nueva se pueda crear: con la anticipación mínima
 * y la duración permitidas. No llama a Date.now(): la hora llega como
 * parámetro, igual que en canCancel.
 */
export function validateNewRental(period: DateRange, now: Date, policy: BookingPolicy = STANDARD_BOOKING): void {
  if (period.hoursUntilStart(now) < policy.minLeadHours) {
    throw new InvalidBookingError(
      `La reserva debe empezar al menos ${policy.minLeadHours} horas después de ahora`,
    );
  }
  const days = period.days();
  if (days < policy.minDays) {
    throw new InvalidBookingError(`La reserva debe durar al menos ${policy.minDays} día(s)`);
  }
  if (days > policy.maxDays) {
    throw new InvalidBookingError(`La reserva no puede durar más de ${policy.maxDays} días`);
  }
}
