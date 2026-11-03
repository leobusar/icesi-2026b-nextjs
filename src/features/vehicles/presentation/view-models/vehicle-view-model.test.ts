import { describe, expect, it } from 'vitest';
import { aVehicle } from '../../testing/fixtures';
import { toVehicleViewModel } from './vehicle-view-model';

describe('toVehicleViewModel', () => {
  it('deja todo listo para pintar', () => {
    const vehicle = aVehicle({ plate: 'KLM482', dailyRate: 150_000 });
    expect(toVehicleViewModel(vehicle)).toEqual({
      id: 1,
      title: 'Mazda CX-30 (2024)',
      plateLabel: 'KLM-482',
      category: 'SUV',
      dailyRateLabel: '$150.000/día',
    });
  });
});
