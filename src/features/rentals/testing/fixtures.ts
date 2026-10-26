import type { Clock } from '@/shared/domain/clock';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { Money } from '@/shared/domain/value-objects/money';
import type { Rental } from '../domain/entities/rental';

const DAY_MS = 24 * 60 * 60 * 1000;

export const fixedClock = (iso: string): Clock => ({ now: () => new Date(iso) });

export function aRental(overrides: { id?: number; start?: string; days?: number; dailyRate?: number } = {}): Rental {
  const start = new Date(overrides.start ?? '2026-11-03T12:00:00Z');
  return {
    id: overrides.id ?? 1,
    vehicle: { brand: 'Mazda', model: 'CX-30' },
    period: DateRange.create(start, new Date(start.getTime() + (overrides.days ?? 7) * DAY_MS)),
    dailyRate: Money.cop(overrides.dailyRate ?? 150_000),
  };
}