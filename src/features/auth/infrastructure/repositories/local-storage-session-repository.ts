import type { SessionRepository } from '../../application/repositories/session-repository';

const TOKEN_KEY = 'token';

export class LocalStorageSessionRepository implements SessionRepository {
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }
}
