import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Money } from '@/shared/domain/value-objects/money';
import { toBookingSummary } from './booking-summary';

describe('toBookingSummary', () => {
  it('calcula el resumen con descuento', () => {
    const period = DateRange.create(new Date('2026-11-03T15:00:00Z'), new Date('2026-11-10T15:00:00Z'));
    const summary = toBookingSummary('Mazda CX-30', period, Money.cop(150_000));

    expect(summary).toEqual({
      vehicleLabel: 'Mazda CX-30',
      dateRangeLabel: '3/11/2026 al 10/11/2026',
      days: '7 días',
      subtotal: '$1.050.000',
      discountLabel: '10 % de descuento',
      total: '$945.000',
    });
  });

  it('no muestra descuento cuando no aplica', () => {
    const period = DateRange.create(new Date('2026-11-03T15:00:00Z'), new Date('2026-11-05T15:00:00Z'));
    const summary = toBookingSummary('Kia Picanto', period, Money.cop(85_000));

    expect(summary.discountLabel).toBeNull();
    expect(summary.total).toBe('$170.000');
  });
});
