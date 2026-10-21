/**
 * Base de todos los errores de negocio.
 * Las capas externas pueden preguntar `error instanceof DomainError`
 * para distinguir un error del negocio de una falla técnica.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
