import type { RentalRepository } from '../application/repositories/rental-repository';
import type { Rental } from '../domain/entities/rental';
import { RentalNotFoundError } from '../domain/errors/rental-errors';

/**
 * Implementación falsa del puerto, en memoria, para pruebas.
 * Demuestra que los casos de uso no dependen de HTTP.
 */
export class InMemoryRentalRepository implements RentalRepository {
  cancelled: number[] = [];
  /** Si se define, cancel() lanza este error (simula que el servidor falla). */
  failCancelWith?: Error;

  constructor(private rentals: Rental[] = []) {}

  async findMine(): Promise<Rental[]> {
    return [...this.rentals];
  }

  async cancel(rentalId: number): Promise<void> {
    if (this.failCancelWith) throw this.failCancelWith;
    if (!this.rentals.some((r) => r.id === rentalId)) throw new RentalNotFoundError(rentalId);
    this.rentals = this.rentals.filter((r) => r.id !== rentalId);
    this.cancelled.push(rentalId);
  }
}