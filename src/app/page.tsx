import Link from 'next/link';

export default function Home() {
  return (
    <section>
      <h1>Alquila un carro por días</h1>
      <p className="muted">
        Ingresa con tu cuenta para ver tus alquileres, o revisa los vehículos disponibles.
      </p>
      <p>
        <Link href="/login">Ingresar</Link> · <Link href="/vehiculos">Ver vehículos</Link> ·{' '}
        <Link href="/mis-alquileres">Mis alquileres</Link>
      </p>
    </section>
  );
}
