import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'RodaYa · Alquiler de vehículos',
  description: 'Proyecto del curso de arquitectura limpia en el frontend',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            RodaYa
          </Link>
          <nav>
            <Link href="/vehiculos">Vehículos</Link>
            <Link href="/mis-alquileres">Mis alquileres</Link>
            <Link href="/login">Ingresar</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
