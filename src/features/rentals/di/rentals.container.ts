import { sharedContainer } from '@/shared/di/shared.container';
import { makeCancelRental } from '../application/use-cases/cancel-rental';
import { makeListMyRentals } from '../application/use-cases/list-my-rentals';
import { HttpRentalRepository } from '../infrastructure/repositories/http-rental-repository';
import type { RentalsUseCases } from '../presentation/hooks/rentals-context';

/**
 * Composición de la feature: el ÚNICO archivo de rentals que importa
 * de infrastructure/.
 */
const rentals = new HttpRentalRepository(sharedContainer.http);
const clock = sharedContainer.clock;

export const rentalsContainer: RentalsUseCases = {
  listMyRentals: makeListMyRentals({ rentals, clock }),
  cancelRental: makeCancelRental({ rentals, clock }),
};
