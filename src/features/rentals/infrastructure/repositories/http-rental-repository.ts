import { HttpError, type HttpClient } from '@/shared/infrastucture/http-client';
import type { RentalRepository } from '../../application/repositories/rental-repository';
import type { Rental } from '../../domain/entities/rental';
import { CancellationNotAllowedError, RentalNotFoundError } from '../../domain/errors/rental-errors';
import type { RentalDto } from '../dtos/rental.dto';
import { toRental } from '../mappers/rental.mapper';


export class HttpRentalRepository implements RentalRepository {
  constructor(private readonly http: HttpClient) {}

  async findMine(): Promise<Rental[]> {
    const dtos = await this.http.get<RentalDto[]>('/rentals/me');
    return dtos.map(toRental);
  }

  async cancel(rentalId: number): Promise<void> {
    try {
      await this.http.delete(`/rentals/${rentalId}`);
    } catch (error) {
      // Traduce el "idioma HTTP" al idioma del negocio.
      if (error instanceof HttpError && error.status === 422) throw new CancellationNotAllowedError(rentalId);
      if (error instanceof HttpError && error.status === 404) throw new RentalNotFoundError(rentalId);
      throw error;
    }
  }
}
