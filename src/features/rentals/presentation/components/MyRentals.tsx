'use client';
import Link from 'next/link';
import { useMyRentals } from '../hooks/use-my-rentals';
import { RentalItem } from './RentalItem';

/**
 *  Componente para mostrar los alquileres del usuario.
 * 
 *  @remarks
 *  Este componente utiliza el hook `useMyRentals` para obtener los alquileres del usuario
 *  y renderizarlos en una lista. También maneja la cancelación de alquileres.
 * 
 */

export function MyRentals() {
  const { state, rentals, cancel, cancellingId, actionError } = useMyRentals();

  if (state.status === 'loading') return <p className="text-zinc-500">Cargando tus alquileres…</p>;
  if (state.status === 'unauthenticated')
    return (
      <p>
        Debes{' '}
        <Link href="/login" className="text-teal-700 underline">
          ingresar
        </Link>{' '}
        para ver tus alquileres.
      </p>
    );
  if (state.status === 'error') return <p className="text-red-700">{state.message}</p>;
  if (rentals.length === 0) return <p className="text-zinc-500">No tienes alquileres.</p>;

  return (
    <>
      {actionError && <p className="mb-3 text-red-700">{actionError}</p>}
      <ul className="flex flex-col gap-2">
        {rentals.map((rental) => (
          <RentalItem
            key={rental.id}
            rental={rental}
            cancelling={cancellingId === rental.id}
            onCancel={cancel}
          />
        ))}
      </ul>
    </>
  );
}
