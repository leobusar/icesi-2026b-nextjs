import { authContainer } from '@/features/auth/di/auth.container';
import { config } from '../infrastucture/config';
import { createGraphQLClient } from '../infrastucture/graphql-client';
import { createHttpClient } from '../infrastucture/http-client';
import { systemClock } from '../infrastucture/system-clock';

/**
 * Dependencias compartidas, armadas una sola vez.
 * Los contenedores de cada feature las reciben de aquí.
 */
export const sharedContainer = {
  clock: systemClock,
  http: createHttpClient({
    baseUrl: config.apiUrl,
    getToken: () => authContainer.session.getAccessToken(),
  }),
  graphql: createGraphQLClient({
    url: `${config.apiUrl}/graphql`,
  }),
};
