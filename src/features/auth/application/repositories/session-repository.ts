export interface SessionRepository {
  getAccessToken(): string | null;
}
