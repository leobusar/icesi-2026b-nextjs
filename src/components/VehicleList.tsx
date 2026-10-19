'use client';
import { useEffect, useState } from 'react';

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    const query = from && to ? `?from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}` : '';
    fetch(`http://localhost:3001/vehicles${query}`)
      .then((r) => r.json())
      .then((data) => setVehicles(data));
  }, [from, to]);

  // Días del periodo elegido (si hay fechas)
  const days = from && to ? Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) : 0;

  return (
    <>
      <form>
        <label>
          Desde <input type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          Hasta <input type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </form>
      <ul>
        {vehicles.map((v) => {
          const total = days * v.daily_rate * (days > 7 ? 0.9 : 1);
          return (
            <li key={v.id}>
              <strong>
                {v.brand_name} {v.model}
              </strong>{' '}
              ({v.year}) · Placa {v.plate.slice(0, 3)}-{v.plate.slice(3)} · ${v.daily_rate.toLocaleString('es-CO')}/día
              {days > 0 && (
                <span className="muted">
                  {' '}
                  · {days} días: ${total.toLocaleString('es-CO')}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
