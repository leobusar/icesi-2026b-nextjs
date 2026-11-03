import type { DateRange } from '@/shared/domain/value-objects/date-range';
import type { Rental } from '../../domain/entities/rental';

export interface NewRental {
  readonly vehicleId: number;
  readonly period: DateRange;
}

/**
 * Puerto: lo que la aplicación necesita para trabajar con alquileres.
 * Lo define quien lo usa (los casos de uso), no quien lo implementa.
 * No sabe nada de HTTP, JSON ni URLs.
 *
 * Implementaciones: infrastructure/repositories/http-rental-repository.ts
 * y, en las pruebas, testing/in-memory-rental-repository.ts.
 */
export interface RentalRepository {
  /** Alquileres del cliente con sesión iniciada. */
  findMine(): Promise<Rental[]>;
  cancel(rentalId: number): Promise<void>;
  create(newRental: NewRental): Promise<Rental>;
}
