import type { Clock } from '../domain/clock';

/** El reloj real. En las pruebas se reemplaza por uno fijo. */
export const systemClock: Clock = { now: () => new Date() };
