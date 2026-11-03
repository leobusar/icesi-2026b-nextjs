import { ServiceUnavailableError, UnauthenticatedError } from '@/shared/application/errors/application-errors';
import { InvalidDateRangeError } from '@/shared/domain/value-objects/date-range';
import {
  CancellationNotAllowedError,
  InvalidBookingError,
  RentalNotFoundError,
  VehicleUnavailableError,
} from '../../domain/errors/rental-errors';

/**
 * Qué le decimos al cliente ante cada error.
 * Los textos son decisión de producto: viven en presentación. Incluye
 * tanto los errores de los casos de uso como los que el formulario de
 * reserva valida al instante (InvalidDateRangeError, InvalidBookingError).
 */
export function messageFor(error: unknown): string {
  if (error instanceof UnauthenticatedError) return 'Tu sesión expiró. Vuelve a ingresar.';
  if (error instanceof CancellationNotAllowedError)
    return 'Este alquiler ya no se puede cancelar desde la web. Llámanos para ayudarte.';
  if (error instanceof RentalNotFoundError) return 'Este alquiler ya no existe. Recarga la página.';
  if (error instanceof VehicleUnavailableError)
    return 'Este vehículo ya no está disponible en esas fechas. Elige otro.';
  if (error instanceof InvalidBookingError) return 'Las fechas ya no son válidas para reservar. Vuelve a elegirlas.';
  if (error instanceof InvalidDateRangeError) return 'La fecha de fin debe ser posterior a la de inicio.';
  if (error instanceof ServiceUnavailableError) return 'No pudimos conectarnos. Intenta de nuevo en unos minutos.';
  return 'Algo salió mal. Intenta de nuevo.';
}
