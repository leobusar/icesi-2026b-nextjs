import { describe, expect, it } from 'vitest';
import { ServiceUnavailableError } from '@/shared/application/errors/application-errors';
import { CancellationNotAllowedError } from '../../domain/errors/rental-errors';
import { aRental, fixedClock } from '../../testing/fixtures';
import { InMemoryRentalRepository } from '../../testing/in-memory-rental-repository';
import { makeCancelRental } from './cancel-rental';

const clock = fixedClock('2026-11-02T10:00:00Z');

describe('cancelRental', () => {
  it('cancela un alquiler al que le faltan más de 24 h', async () => {
    const rental = aRental({ id: 7, start: '2026-11-03T12:00:00Z' });
    const repository = new InMemoryRentalRepository([rental]);

    await makeCancelRental({ rentals: repository, clock })(rental);

    expect(repository.cancelled).toEqual([7]);
    expect(await repository.findMine()).toEqual([]);
  });

  it('no llama al servidor si ya no se puede cancelar', async () => {
    const rental = aRental({ id: 7, start: '2026-11-03T09:00:00Z' }); // faltan 23 h
    const repository = new InMemoryRentalRepository([rental]);

    await expect(makeCancelRental({ rentals: repository, clock })(rental)).rejects.toBeInstanceOf(
      CancellationNotAllowedError,
    );
    expect(repository.cancelled).toEqual([]);
  });

  it('propaga el error si el servidor falla, y el alquiler sigue existiendo', async () => {
    const rental = aRental({ id: 7, start: '2026-11-03T12:00:00Z' });
    const repository = new InMemoryRentalRepository([rental]);
    repository.failCancelWith = new ServiceUnavailableError();

    await expect(makeCancelRental({ rentals: repository, clock })(rental)).rejects.toBeInstanceOf(
      ServiceUnavailableError,
    );
    expect(await repository.findMine()).toHaveLength(1);
  });
});