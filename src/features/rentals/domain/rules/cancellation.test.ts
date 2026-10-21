import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Money } from '@/shared/domain/value-objects/money';
import type { Rental } from '../entities/rental';
import { canCancel } from './cancellation';

const rentalStartingAt = (iso: string): Rental => {
  const start = new Date(iso);
  return {
    id: 1,
    vehicle: { brand: 'Mazda', model: 'CX-30' },
    period: DateRange.create(start, new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000)),
    dailyRate: Money.cop(150_000),
  };
};

// Hora actual fija: 2 nov 10:00 UTC.
const now = new Date('2026-11-02T10:00:00Z');

describe('canCancel', () => {
  it.each([
    ['2026-11-03T12:00:00Z', '26 h', true],
    ['2026-11-03T10:00:00Z', '24 h exactas', false],
    ['2026-11-03T09:00:00Z', '23 h', false],
    ['2026-11-01T10:00:00Z', 'ya empezó', false],
  ])('inicio %s (faltan %s) → %s', (start, _label, expected) => {
    expect(canCancel(rentalStartingAt(start), now)).toBe(expected);
  });

  it('acepta otra política (48 h)', () => {
    const rental = rentalStartingAt('2026-11-03T12:00:00Z'); // faltan 26 h
    expect(canCancel(rental, now, { minHoursBeforeStart: 48 })).toBe(false);
  });
});
