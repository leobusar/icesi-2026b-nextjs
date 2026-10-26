import { describe, expect, it } from 'vitest';
import { aRental, fixedClock } from '../../testing/fixtures';
import { InMemoryRentalRepository } from '../../testing/in-memory-rental-repository';
import { makeListMyRentals } from './list-my-rentals';

const clock = fixedClock('2026-11-02T10:00:00Z');

describe('listMyRentals', () => {
  it('devuelve cada alquiler con su precio y si se puede cancelar', async () => {
    const repository = new InMemoryRentalRepository([
      aRental({ id: 1, start: '2026-11-03T12:00:00Z', days: 7 }), // faltan 26 h
      aRental({ id: 2, start: '2026-11-03T09:00:00Z', days: 3 }), // faltan 23 h
    ]);
    const listMyRentals = makeListMyRentals({ rentals: repository, clock });

    const [first, second] = await listMyRentals();

    expect(first.price.total.amount).toBe(945_000);
    expect(first.canCancel).toBe(true);
    expect(second.price.total.amount).toBe(450_000);
    expect(second.canCancel).toBe(false);
  });

  it('usa las políticas que recibe', async () => {
    const repository = new InMemoryRentalRepository([aRental({ start: '2026-11-03T12:00:00Z', days: 3 })]);
    const listMyRentals = makeListMyRentals({
      rentals: repository,
      clock,
      discountPolicy: { minDays: 3, percentage: 20 },
      cancellationPolicy: { minHoursBeforeStart: 48 },
    });

    const [summary] = await listMyRentals();

    expect(summary.price.total.amount).toBe(360_000);
    expect(summary.canCancel).toBe(false);
  });

  it('devuelve una lista vacía si el cliente no tiene alquileres', async () => {
    const listMyRentals = makeListMyRentals({ rentals: new InMemoryRentalRepository(), clock });
    expect(await listMyRentals()).toEqual([]);
  });
});