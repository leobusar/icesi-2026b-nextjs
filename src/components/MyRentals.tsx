'use client';
import { useEffect, useState } from 'react';

export default function MyRentals() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/rentals/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((data) => setItems(data))
      .catch(() => setError('Error cargando'));
  }, []);

  const cancel = async (id: number) => {
    await fetch(`http://localhost:3001/rentals/${id}`, { method: 'DELETE' });
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <ul>
      {items.map((r) => {
        const start = new Date(r.start_date);
        const days = Math.ceil(
          (new Date(r.end_date).getTime() - start.getTime()) / 86_400_000
        );
        const total = days * r.daily_rate * (days >= 7 ? 0.9 : 1);
        const canCancel = start.getTime() - Date.now() > 24 * 60 * 60 * 1000;
        return (
          <li key={r.id}>
            {r.brand_name} {r.model} — {start.toLocaleDateString('es-CO')} ·{' '}
            {days} días · ${total.toLocaleString('es-CO')}
            {canCancel && <button onClick={() => cancel(r.id)}>Cancelar</button>}
          </li>
        );
      })}
      {error && <p>{error}</p>}
    </ul>
  );
}
