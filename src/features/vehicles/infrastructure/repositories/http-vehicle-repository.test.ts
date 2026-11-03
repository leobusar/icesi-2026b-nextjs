import { describe, expect, it } from 'vitest';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import { createHttpClient } from '@/shared/infrastucture/http-client';
import { HttpVehicleRepository } from './http-vehicle-repository';

function fakeFetch(body: unknown) {
  const calls: { url: string }[] = [];
  const fetchFn = (async (url: string) => {
    calls.push({ url });
    return new Response(JSON.stringify(body), { status: 200 });
  }) as typeof fetch;
  return { fetchFn, calls };
}

describe('HttpVehicleRepository', () => {
  it('pide /vehicles con el periodo en la query y devuelve entidades', async () => {
    const { fetchFn, calls } = fakeFetch([
      { id: 1, plate: 'KLM482', brand_name: 'Mazda', model: 'CX-30', year: 2024, category: 'SUV', daily_rate: 150000 },
    ]);
    const http = createHttpClient({ baseUrl: 'http://api', getToken: () => null, fetchFn });
    const repository = new HttpVehicleRepository(http);
    const period = DateRange.create(new Date('2026-11-03T10:00:00.000Z'), new Date('2026-11-05T10:00:00.000Z'));

    const vehicles = await repository.findAvailable(period);

    expect(vehicles[0].brand).toBe('Mazda');
    expect(calls[0].url).toBe(
      'http://api/vehicles?from=2026-11-03T10%3A00%3A00.000Z&to=2026-11-05T10%3A00%3A00.000Z',
    );
  });
});
