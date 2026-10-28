import { describe, expect, it } from 'vitest';
import { calculatePrice } from '../../domain/rules/pricing';
import { aRental } from '../../testing/fixtures';
import { toRentalViewModel } from './rental-view-model';

describe('toRentalViewModel', () => {
  it('deja todo listo para pintar', () => {
    const rental = aRental({ id: 5, start: '2026-11-03T15:00:00Z', days: 7 });
    const vm = toRentalViewModel({ rental, price: calculatePrice(rental.period, rental.dailyRate), canCancel: true });

    expect(vm).toEqual({
      id: 5,
      vehicle: 'Mazda CX-30',
      startDate: '3/11/2026',
      days: '7 días',
      total: '$945.000',
      discount: '10 % de descuento',
      canCancel: true,
    });
  });

  it('no muestra descuento cuando no aplica', () => {
    const rental = aRental({ days: 1 });
    const vm = toRentalViewModel({ rental, price: calculatePrice(rental.period, rental.dailyRate), canCancel: false });
    expect(vm.days).toBe('1 día');
    expect(vm.discount).toBeNull();
  });
});
