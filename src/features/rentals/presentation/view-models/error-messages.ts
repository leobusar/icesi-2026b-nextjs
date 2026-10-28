import { ServiceUnavailableError, UnauthenticatedError } from '@/shared/application/errors/application-errors';
import { CancellationNotAllowedError, RentalNotFoundError } from '../../domain/errors/rental-errors';

/**
 * Qué le decimos al cliente ante cada error.
 * Los textos son decisión de producto: viven en presentación.
 */
export function messageFor(error: unknown): string {
  if (error instanceof UnauthenticatedError) return 'Tu sesión expiró. Vuelve a ingresar.';
  if (error instanceof CancellationNotAllowedError)
    return 'Este alquiler ya no se puede cancelar desde la web. Llámanos para ayudarte.';
  if (error instanceof RentalNotFoundError) return 'Este alquiler ya no existe. Recarga la página.';
  if (error instanceof ServiceUnavailableError) return 'No pudimos conectarnos. Intenta de nuevo en unos minutos.';
  return 'Algo salió mal. Intenta de nuevo.';
}
