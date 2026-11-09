import { GraphQLClient } from 'graphql-request';
import { ServiceUnavailableError } from '../application/errors/application-errors';

export interface GraphQLHttpClient {
  request<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
}

interface Options {
  url: string;
  fetchFn?: typeof fetch;
}

/**
 * Cliente GraphQL compartido, hermano de http-client.ts. Lo único distinto
 * de verdad: GraphQL casi siempre responde 200 incluso cuando hay un error,
 * el detalle viaja en el cuerpo (`errors`), no en el código HTTP — por eso
 * acá no hay nada que mirar un status como en http-client.ts, cualquier
 * falla (de red o de GraphQL) llega por la misma vía: la promesa rechaza.
 * Hoy no hay ningún error de negocio que esta operación pueda devolver,
 * así que toda falla se traduce a ServiceUnavailableError; si el día de
 * mañana una consulta necesita distinguir un error de negocio específico,
 * se lee `error.response.errors[].extensions.code` (la librería lo expone
 * en `ClientError`) antes de decidir a qué error de dominio traducirlo.
 */
export function createGraphQLClient({ url, fetchFn }: Options): GraphQLHttpClient {
  const client = new GraphQLClient(url, fetchFn ? { fetch: fetchFn } : undefined);

  return {
    async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
      try {
        return await client.request<T>(query, variables);
      } catch (cause) {
        throw new ServiceUnavailableError(cause);
      }
    },
  };
}
