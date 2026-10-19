'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('ana@correo.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError('Correo o contraseña incorrectos');
      return;
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    router.push('/mis-alquileres');
  };

  return (
    <section>
      <h1>Ingresar</h1>
      <form onSubmit={submit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <button className="primary" type="submit">
          Ingresar
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
