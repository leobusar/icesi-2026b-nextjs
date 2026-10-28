import type { Metadata } from 'next';
import Link from 'next/link';
import { RentalsProvider } from '@/features/rentals';
import './globals.css';

export const metadata: Metadata = {
  title: 'RodaYa · Alquiler de vehículos',
  description: 'Proyecto de alquiler de vehículos para la clase de CI3 de la Universidad Icesi',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
          <Link href="/" className="text-lg font-bold text-zinc-900">
            RodaYa
          </Link>
          <nav className="flex gap-5 text-sm">
            <Link href="/vehiculos">Vehículos</Link>
            <Link href="/mis-alquileres">Mis alquileres</Link>
            <Link href="/login">Ingresar</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-8">
          <RentalsProvider>{children}</RentalsProvider>
        </main>
      </body>
    </html>
  );
}
