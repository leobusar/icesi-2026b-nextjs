import type { SessionRepository } from '../application/repositories/session-repository';
import { LocalStorageSessionRepository } from '../infrastructure/repositories/local-storage-session-repository';

/** Cambiar la forma de guardar la sesión = cambiar esta línea. */
const session: SessionRepository = new LocalStorageSessionRepository();

export const authContainer = { session };
