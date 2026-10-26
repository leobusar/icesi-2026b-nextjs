import { describe, expect, it } from 'vitest';
import { UnauthenticatedError } from '@/shared/application/errors/application-errors';
import { createHttpClient } from '@/shared/infrastucture/http-client';
import { CancellationNotAllowedError } from '../../domain/errors/rental-errors';
import { HttpRentalRepository } from './http-rental-repository';

/** fetch falso que responde según la ruta y registra lo que recibió. */
function fakeFetch(responses: Record<string, { status: number; body?: unknown }>) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetchFn = (async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const key = `${init?.method ?? 'GET'} ${url.replace('http://api', '')}`;
    const r = responses[key] ?? { status: 404 };
    return new Response(r.body === undefined ? null : JSON.stringify(r.body), { status: r.status });
  }) as typeof fetch;
  return { fetchFn, calls };
}

const repositoryWith = (responses: Record<string, { status: number; body?: unknown }>, token = 'abc') => {
  const { fetchFn, calls } = fakeFetch(responses);
  const http = createHttpClient({ baseUrl: 'http://api', getToken: () => token, fetchFn });
  return { repository: new HttpRentalRepository(http), calls };
};

describe('HttpRentalRepository', () => {
  it('pide /rentals/me con el token y devuelve entidades', async () => {
    const { repository, calls } = repositoryWith({
      'GET /rentals/me': {
        status: 200,
        body: [
          {
            id: 1,
            vehicle_id: 1,
            plate: 'KLM482',
            brand_name: 'Mazda',
            model: 'CX-30',
            category: 'SUV',
            start_date: '2026-11-03T15:00:00.000Z',
            end_date: '2026-11-05T15:00:00.000Z',
            daily_rate: 150000,
          },
        ],
      },
    });

    const rentals = await repository.findMine();

    expect(rentals[0].vehicle.brand).toBe('Mazda');
    expect((calls[0].init?.headers as Record<string, string>).Authorization).toBe('Bearer abc');
  });

  it('envía el token también al cancelar (el código legado lo olvidaba)', async () => {
    const { repository, calls } = repositoryWith({ 'DELETE /rentals/7': { status: 204 } });
    await repository.cancel(7);
    expect((calls[0].init?.headers as Record<string, string>).Authorization).toBe('Bearer abc');
  });

  it('traduce un 422 a CancellationNotAllowedError', async () => {
    const { repository } = repositoryWith({ 'DELETE /rentals/7': { status: 422, body: { message: 'x' } } });
    await expect(repository.cancel(7)).rejects.toBeInstanceOf(CancellationNotAllowedError);
  });

  it('traduce un 401 a UnauthenticatedError', async () => {
    const { repository } = repositoryWith({ 'GET /rentals/me': { status: 401 } }, '');
    await expect(repository.findMine()).rejects.toBeInstanceOf(UnauthenticatedError);
  });
});
