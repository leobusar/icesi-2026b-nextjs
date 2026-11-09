import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { ServiceUnavailableError } from '@/shared/application/errors/application-errors';
import { createGraphQLClient } from '@/shared/infrastucture/graphql-client';
import { GraphQLVehicleRepository } from './graphql-vehicle-repository';

function fakeFetch(status: number, body: unknown) {
  const calls: { body: string }[] = [];
  const fetchFn = (async (_url: string, init?: RequestInit) => {
    calls.push({ body: init?.body as string });
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }) as typeof fetch;
  return { fetchFn, calls };
}

const period = DateRange.create(new Date('2026-12-20T00:00:00.000Z'), new Date('2026-12-25T00:00:00.000Z'));

describe('GraphQLVehicleRepository', () => {
  it('manda el periodo como variables y devuelve entidades', async () => {
    const { fetchFn, calls } = fakeFetch(200, {
      data: {
        availableVehicles: [
          { id: '1', plate: 'KLM482', brand: 'Mazda', model: 'CX-30', year: 2024, category: 'SUV', dailyRate: 150000 },
        ],
      },
    });
    const graphql = createGraphQLClient({ url: 'http://api/graphql', fetchFn });
    const repository = new GraphQLVehicleRepository(graphql);

    const vehicles = await repository.findAvailable(period);

    expect(vehicles).toHaveLength(1);
    expect(vehicles[0].brand).toBe('Mazda');
    expect(vehicles[0].id).toBe(1);

    const sent = JSON.parse(calls[0].body);
    expect(sent.variables).toEqual({
      from: '2026-12-20T00:00:00.000Z',
      to: '2026-12-25T00:00:00.000Z',
    });
  });

  it('traduce un error de GraphQL (200 con "errors") a ServiceUnavailableError', async () => {
    const { fetchFn } = fakeFetch(200, { errors: [{ message: 'algo salió mal' }] });
    const graphql = createGraphQLClient({ url: 'http://api/graphql', fetchFn });
    const repository = new GraphQLVehicleRepository(graphql);

    await expect(repository.findAvailable(period)).rejects.toBeInstanceOf(ServiceUnavailableError);
  });

  it('traduce un fallo de red a ServiceUnavailableError', async () => {
    const fetchFn = (async () => {
      throw new Error('conexión caída');
    }) as typeof fetch;
    const graphql = createGraphQLClient({ url: 'http://api/graphql', fetchFn });
    const repository = new GraphQLVehicleRepository(graphql);

    await expect(repository.findAvailable(period)).rejects.toBeInstanceOf(ServiceUnavailableError);
  });
});
