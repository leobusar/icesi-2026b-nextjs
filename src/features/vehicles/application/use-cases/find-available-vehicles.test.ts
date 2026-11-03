import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { aVehicle } from '../../testing/fixtures';
import { InMemoryVehicleRepository } from '../../testing/in-memory-vehicle-repository';
import { makeFindAvailableVehicles } from './find-available-vehicles';

describe('findAvailableVehicles', () => {
  it('devuelve los carros que el repositorio marca como disponibles', async () => {
    const repository = new InMemoryVehicleRepository([aVehicle({ id: 1 }), aVehicle({ id: 2 })]);
    const findAvailableVehicles = makeFindAvailableVehicles({ vehicles: repository });
    const period = DateRange.create(new Date('2026-11-03T10:00:00Z'), new Date('2026-11-05T10:00:00Z'));

    const vehicles = await findAvailableVehicles(period);

    expect(vehicles.map((v) => v.id)).toEqual([1, 2]);
    expect(repository.lastPeriod).toBe(period);
  });
});
