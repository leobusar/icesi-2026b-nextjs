import { Money } from '@/shared/domain/value-objects/money';
import type { NewRental, RentalRepository } from '../application/repositories/rental-repository';
import type { Rental } from '../domain/entities/rental';
import { RentalNotFoundError } from '../domain/errors/rental-errors';

/**
 * Implementación falsa del puerto, en memoria, para pruebas.
 * Demuestra que los casos de uso no dependen de HTTP.
 */
export class InMemoryRentalRepository implements RentalRepository {
  cancelled: number[] = [];
  created: NewRental[] = [];
  /** Si se define, cancel()/create() lanza este error (simula que el servidor falla). */
  failCancelWith?: Error;
  failCreateWith?: Error;
  private nextId = 1000;

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

  async create(newRental: NewRental): Promise<Rental> {
    if (this.failCreateWith) throw this.failCreateWith;
    this.created.push(newRental);
    const rental: Rental = {
      id: this.nextId++,
      vehicle: { brand: 'Vehículo', model: `#${newRental.vehicleId}` },
      period: newRental.period,
      dailyRate: Money.zero(),
    };
    this.rentals.push(rental);
    return rental;
  }
}
