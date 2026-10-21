import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Money } from '@/shared/domain/value-objects/money';
import { calculatePrice } from './pricing';

const DAY_MS = 24 * 60 * 60 * 1000;
const periodOf = (days: number) => {
  const start = new Date('2026-11-03T10:00:00Z');
  return DateRange.create(start, new Date(start.getTime() + days * DAY_MS));
};
const rate = Money.cop(150_000);

describe('calculatePrice', () => {
  it.each([
    [3, 450_000, 0, 450_000],
    [6, 900_000, 0, 900_000],
    [7, 1_050_000, 10, 945_000], // justo 7 días: SÍ aplica descuento
    [10, 1_500_000, 10, 1_350_000],
  ])('%i días a $150.000: subtotal %i, descuento %i %%, total %i', (days, subtotal, discount, total) => {
    const price = calculatePrice(periodOf(days), rate);
    expect(price.days).toBe(days);
    expect(price.subtotal.amount).toBe(subtotal);
    expect(price.discountPercentage).toBe(discount);
    expect(price.total.amount).toBe(total);
  });

  it('cobra un día completo por una fracción de día', () => {
    const start = new Date('2026-11-03T10:00:00Z');
    const period = DateRange.create(start, new Date('2026-11-05T11:00:00Z')); // 49 h
    expect(calculatePrice(period, rate).total.amount).toBe(450_000);
  });

  it('acepta otra política de descuento (temporada)', () => {
    const price = calculatePrice(periodOf(5), rate, { minDays: 5, percentage: 15 });
    expect(price.discountPercentage).toBe(15);
    expect(price.total.amount).toBe(637_500);
  });
});
