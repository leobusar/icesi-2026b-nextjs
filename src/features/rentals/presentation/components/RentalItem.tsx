import type { RentalViewModel } from '../view-models/rental-view-model';

interface Props {
  rental: RentalViewModel;
  cancelling: boolean;
  onCancel: (id: number) => void;
}
/** 
 * Componente para mostrar un alquiler.
 * 
 * @param rental - El modelo de vista del alquiler.
 * @param cancelling - Indica si se está cancelando el alquiler.
 * @param onCancel - Función para cancelar el alquiler.
 */

/**
 * Botón de RentalItem
  → cancel(id) del hook
  → cancelRental(alquiler)
  → repositorio.cancel(id)
  → DELETE /rentals/id
 **/

/** solo pinta. No calcula, no formatea, no llama al servidor. */
export function RentalItem({ rental, cancelling, onCancel }: Props) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4">
      <span>
        {rental.vehicle} — {rental.startDate} · {rental.days} · {rental.total}
        {rental.discount && <span className="text-zinc-500"> ({rental.discount})</span>}
      </span>
      {rental.canCancel && (
        <button
          onClick={() => onCancel(rental.id)}
          disabled={cancelling}
          className="shrink-0 rounded-md border border-red-700 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelling ? 'Cancelando…' : 'Cancelar'}
        </button>
      )}
    </li>
  );
}
