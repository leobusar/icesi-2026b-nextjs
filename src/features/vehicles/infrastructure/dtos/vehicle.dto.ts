/**
 * Forma EXACTA de lo que devuelve la consulta GraphQL `availableVehicles`.
 * `id` llega como string: el tipo `ID` de GraphQL siempre se serializa así.
 */
export interface VehicleDto {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  dailyRate: number;
}
