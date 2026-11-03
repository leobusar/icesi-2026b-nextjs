import { DomainError } from '@/shared/domain/errors/domain-error';

export class CancellationNotAllowedError extends DomainError {
  constructor(readonly rentalId: number) {
    super(`El alquiler ${rentalId} ya no se puede cancelar`);
  }
}

export class RentalNotFoundError extends DomainError {
  constructor(readonly rentalId: number) {
    super(`El alquiler ${rentalId} no existe`);
  }
}

/** Las fechas o la duración de una reserva nueva no cumplen la política. */
export class InvalidBookingError extends DomainError {}

export class VehicleUnavailableError extends DomainError {
  constructor(readonly vehicleId: number) {
    super(`El vehículo ${vehicleId} ya no está disponible en esas fechas`);
  }
}
