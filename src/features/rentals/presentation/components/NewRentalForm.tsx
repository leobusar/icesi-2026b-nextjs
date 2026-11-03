'use client';
import { useState } from 'react';
import { DateRange } from '@/shared/domain/value-objects/date-range';
import type { Money } from '@/shared/domain/value-objects/money';
import { validateNewRental } from '../../domain/rules/booking';
import { useCreateRental } from '../hooks/use-create-rental';
import { toBookingSummary } from '../view-models/booking-summary';
import { messageFor } from '../view-models/error-messages';

export interface SelectedVehicle {
  id: number;
  label: string;
  dailyRate: Money;
}

interface Props {
  /** Fechas ya validadas, o null si todavía no se eligen. */
  period: DateRange | null;
  /** Carro elegido en la lista de vehicles, o null si todavía no hay uno. */
  vehicle: SelectedVehicle | null;
  onValidPeriod: (period: DateRange) => void;
  onCancelVehicle: () => void;
  onConfirmed: () => void;
}

/**
 * Dos pasos en un solo componente, según lo que ya se tiene:
 * sin período → formulario de fechas; con período y carro → resumen
 * y confirmación. La página (app/reservar) decide cuándo mostrar la
 * lista de carros disponibles entre uno y otro paso.
 */
export function NewRentalForm({ period, vehicle, onValidPeriod, onCancelVehicle, onConfirmed }: Props) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);
  const { create, creating, error } = useCreateRental();

  const submitDates = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);
    try {
      const range = DateRange.create(new Date(start), new Date(end));
      validateNewRental(range, new Date());
      onValidPeriod(range);
    } catch (cause) {
      setDateError(messageFor(cause));
    }
  };

  const confirm = async () => {
    if (!vehicle || !period) return;
    if (await create({ vehicleId: vehicle.id, period })) onConfirmed();
  };

  if (vehicle && period) {
    const summary = toBookingSummary(vehicle.label, period, vehicle.dailyRate);
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-4">
        <h2 className="font-semibold">{summary.vehicleLabel}</h2>
        <p className="text-sm text-zinc-500">
          {summary.dateRangeLabel} · {summary.days}
        </p>
        <p className="mt-2">
          {summary.discountLabel ? (
            <>
              <span className="text-zinc-400 line-through">{summary.subtotal}</span>{' '}
              <span className="font-semibold">{summary.total}</span>{' '}
              <span className="text-sm text-zinc-500">({summary.discountLabel})</span>
            </>
          ) : (
            <span className="font-semibold">{summary.total}</span>
          )}
        </p>
        {error && <p className="mt-2 text-red-700">{error}</p>}
        <div className="mt-4 flex gap-3">
          <button
            onClick={confirm}
            disabled={creating}
            className="rounded-md bg-teal-700 px-4 py-2 text-white disabled:opacity-50"
          >
            {creating ? 'Reservando…' : 'Confirmar reserva'}
          </button>
          <button onClick={onCancelVehicle} className="rounded-md border border-zinc-300 px-4 py-2">
            Elegir otro carro
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitDates} className="flex flex-wrap items-end gap-4">
      <label className="flex flex-col text-sm">
        Desde
        <input
          type="datetime-local"
          required
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="rounded-md border border-zinc-300 px-2 py-1"
        />
      </label>
      <label className="flex flex-col text-sm">
        Hasta
        <input
          type="datetime-local"
          required
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="rounded-md border border-zinc-300 px-2 py-1"
        />
      </label>
      <button type="submit" className="rounded-md bg-teal-700 px-4 py-2 text-white">
        Buscar carros
      </button>
      {dateError && <p className="w-full text-red-700">{dateError}</p>}
    </form>
  );
}
