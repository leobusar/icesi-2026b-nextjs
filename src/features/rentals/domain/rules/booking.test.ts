import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { InvalidBookingError } from '../errors/rental-errors';
import { validateNewRental } from './booking';

const now = new Date('2026-11-01T10:00:00Z');
const d = (iso: string) => new Date(iso);

describe('validateNewRental', () => {
  it.each([
    ['2026-11-01T12:00:00Z', '2026-11-02T12:00:00Z', 'empieza en 2 h, dura 1 día'],
    ['2026-11-15T10:00:00Z', '2026-12-01T10:00:00Z', '30 días exactos'],
  ])('acepta una reserva válida (%s a %s: %s)', (start, end) => {
    expect(() => validateNewRental(DateRange.create(d(start), d(end)), now)).not.toThrow();
  });

  it('rechaza una reserva que empieza en menos de 2 horas', () => {
    const period = DateRange.create(d('2026-11-01T11:59:00Z'), d('2026-11-02T11:59:00Z'));
    expect(() => validateNewRental(period, now)).toThrow(InvalidBookingError);
  });

  it('rechaza una reserva de menos de un día', () => {
    // Nunca debería pasar de DateRange.days() (redondea a 1), pero la
    // política igual se prueba con el límite exacto en minDays.
    const period = DateRange.create(d('2026-11-02T10:00:00Z'), d('2026-11-02T12:00:00Z'));
    expect(() => validateNewRental(period, now, { minLeadHours: 2, minDays: 2, maxDays: 30 })).toThrow(
      InvalidBookingError,
    );
  });

  it('rechaza una reserva de más de 30 días', () => {
    const period = DateRange.create(d('2026-11-15T10:00:00Z'), d('2026-12-16T10:00:01Z'));
    expect(() => validateNewRental(period, now)).toThrow(InvalidBookingError);
  });

  it('acepta otra política', () => {
    const period = DateRange.create(d('2026-11-01T20:00:00Z'), d('2026-11-03T10:00:00Z'));
    expect(() => validateNewRental(period, now, { minLeadHours: 6, minDays: 1, maxDays: 30 })).not.toThrow();
  });
});
