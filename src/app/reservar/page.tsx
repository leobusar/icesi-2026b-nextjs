'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewRentalForm, type SelectedVehicle } from '@/features/rentals';
import { AvailableVehicles, type Vehicle } from '@/features/vehicles';
import type { DateRange } from '@/shared/domain/value-objects/date-range';

/**
 * Junta las dos features sin que ninguna importe a la otra: esta página
 * guarda las fechas y el carro elegido, y se los pasa a cada una por props.
 */
export default function ReservarPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<DateRange | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const selectedVehicle: SelectedVehicle | null = vehicle
    ? { id: vehicle.id, label: `${vehicle.brand} ${vehicle.model}`, dailyRate: vehicle.dailyRate }
    : null;

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Reservar un carro</h1>
      <NewRentalForm
        period={period}
        vehicle={selectedVehicle}
        onValidPeriod={setPeriod}
        onCancelVehicle={() => setVehicle(null)}
        onConfirmed={() => router.push('/mis-alquileres')}
      />
      {period && !vehicle && <AvailableVehicles period={period} onSelect={setVehicle} />}
    </section>
  );
}
