import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { InvalidBookingError } from '../../domain/errors/rental-errors';
import { fixedClock } from '../../testing/fixtures';
import { InMemoryRentalRepository } from '../../testing/in-memory-rental-repository';
import { makeCreateRental } from './create-rental';

const clock = fixedClock('2026-11-01T10:00:00Z');
const period = DateRange.create(new Date('2026-11-01T14:00:00Z'), new Date('2026-11-05T14:00:00Z'));

describe('createRental', () => {
  it('crea una reserva válida', async () => {
    const repository = new InMemoryRentalRepository();
    const createRental = makeCreateRental({ rentals: repository, clock });

    const rental = await createRental({ vehicleId: 7, period });

    expect(repository.created).toEqual([{ vehicleId: 7, period }]);
    expect(rental.period).toBe(period);
  });

  it('no llama al servidor si la reserva no cumple la política', async () => {
    const repository = new InMemoryRentalRepository();
    const createRental = makeCreateRental({ rentals: repository, clock });
    const tooSoon = DateRange.create(new Date('2026-11-01T10:30:00Z'), new Date('2026-11-02T10:30:00Z'));

    await expect(createRental({ vehicleId: 7, period: tooSoon })).rejects.toBeInstanceOf(InvalidBookingError);
    expect(repository.created).toEqual([]);
  });

  it('propaga el error si el vehículo ya no está disponible', async () => {
    const repository = new InMemoryRentalRepository();
    repository.failCreateWith = new Error('conflicto');
    const createRental = makeCreateRental({ rentals: repository, clock });

    await expect(createRental({ vehicleId: 7, period })).rejects.toThrow('conflicto');
  });
});
