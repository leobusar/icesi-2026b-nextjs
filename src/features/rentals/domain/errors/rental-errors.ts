import { DomainError } from "@/shared/domain/errors/domain-error";

export class CancellationNotAllowedError extends DomainError{
    constructor(readonly rentalId: number) {
        super(`El alquiler ${rentalId} ya no se puede cancelar`);
    }
}

export class RentalNotFoundError extends DomainError{
    constructor(readonly rentalId: number) {
        super(`El alquiler ${rentalId} no existe`);
    }
}
