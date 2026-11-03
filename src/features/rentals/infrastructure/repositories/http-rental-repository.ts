import { HttpError, type HttpClient } from '@/shared/infrastucture/http-client';
import type { NewRental, RentalRepository } from '../../application/repositories/rental-repository';
import type { Rental } from '../../domain/entities/rental';
import {
  CancellationNotAllowedError,
  RentalNotFoundError,
  VehicleUnavailableError,
} from '../../domain/errors/rental-errors';
import type { RentalDto } from '../dtos/rental.dto';
import { toCreateRentalDto, toRental } from '../mappers/rental.mapper';


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

  async create(newRental: NewRental): Promise<Rental> {
    try {
      const dto = await this.http.post<RentalDto>('/rentals', toCreateRentalDto(newRental));
      return toRental(dto);
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) throw new VehicleUnavailableError(newRental.vehicleId);
      throw error;
    }
  }
}
