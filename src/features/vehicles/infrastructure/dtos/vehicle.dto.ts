/** Forma EXACTA del JSON que devuelve GET /vehicles. */
export interface VehicleDto {
  id: number;
  plate: string;
  brand_name: string;
  model: string;
  year: number;
  category: string;
  daily_rate: number;
}
