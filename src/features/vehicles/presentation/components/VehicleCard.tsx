import type { VehicleViewModel } from '../view-models/vehicle-view-model';

interface Props {
  vehicle: VehicleViewModel;
  onSelect: (id: number) => void;
}

/** Solo pinta. No calcula nada, no llama al servidor. */
export function VehicleCard({ vehicle, onSelect }: Props) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <p className="font-semibold">{vehicle.title}</p>
        <p className="text-sm text-zinc-500">
          Placa {vehicle.plateLabel} · {vehicle.category} · {vehicle.dailyRateLabel}
        </p>
      </div>
      <button
        onClick={() => onSelect(vehicle.id)}
        className="shrink-0 rounded-md bg-teal-700 px-3 py-1 text-sm text-white"
      >
        Reservar
      </button>
    </li>
  );
}
