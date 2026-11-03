/**
 * Política para crear una reserva nueva: con cuánta anticipación mínima
 * debe empezar, y cuántos días puede durar como mínimo y como máximo.
 * Es un dato, igual que DiscountPolicy y CancellationPolicy.
 */
export interface BookingPolicy {
  /** La reserva debe empezar al menos estas horas después de ahora. */
  readonly minLeadHours: number;
  readonly minDays: number;
  readonly maxDays: number;
}

export const STANDARD_BOOKING: BookingPolicy = { minLeadHours: 2, minDays: 1, maxDays: 30 };
