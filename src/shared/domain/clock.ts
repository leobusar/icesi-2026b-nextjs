/**
 * Puerto para obtener la hora actual.
 * El dominio nunca llama a Date.now(): recibe la hora como parámetro,
 * y los casos de uso la piden a un Clock que se inyecta.
 */

export interface Clock {
  now(): Date;
}