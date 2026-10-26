/**
 * Fallas que no son reglas del negocio pero que la aplicación
 * debe distinguir para reaccionar (pedir login, reintentar...).
 * Infraestructura traduce los códigos HTTP a estos errores.
 */
export class UnauthenticatedError extends Error {
  constructor() {
    super('No hay una sesión válida');
    this.name = 'UnauthenticatedError';
  }
}

export class ServiceUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('El servicio no está disponible', { cause });
    this.name = 'ServiceUnavailableError';
  }
}