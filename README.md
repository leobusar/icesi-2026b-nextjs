# RodaYa · Arquitectura limpia en el frontend

Proyecto del curso **Arquitectura limpia en el frontend con Next.js**. Es el frontend de una empresa de alquiler de vehículos: el cliente inicia sesión, ve sus alquileres, consulta vehículos disponibles y cancela reservas.

El código de la rama `main` **funciona, pero está mal organizado a propósito**. Es el punto de partida que vamos a refactorizar durante el curso.

## Requisitos

- Node.js 20 o superior
- npm

## Cómo ejecutarlo

Se necesitan dos terminales:

```bash
npm install

# Terminal 1: API simulada en http://localhost:3001
npm run api

# Terminal 2: frontend en http://localhost:3000
npm run dev
```

Usuarios de prueba (contraseña `123456` para ambos):

| Usuario | Correo |
| --- | --- |
| Ana Gómez | `ana@correo.com` |
| Pedro Ruiz | `pedro@correo.com` |

## La API simulada

`mock-api/server.mjs` imita el backend en NestJS: rutas y JSON en `snake_case`. No tiene dependencias y guarda los datos en memoria, así que al reiniciarla todo vuelve al estado inicial. Las fechas de los alquileres se generan relativas al momento en que arranca, para que siempre haya alquileres que se pueden cancelar y otros que no.

| Método | Ruta | Autenticación | Descripción |
| --- | --- | --- | --- |
| `POST` | `/auth/login` | No | Recibe `{ email, password }` y devuelve `{ access_token, user }` |
| `GET` | `/vehicles?from=&to=` | No | Lista de vehículos; con fechas ISO, solo los disponibles |
| `GET` | `/rentals/me` | Sí | Alquileres del usuario autenticado |
| `DELETE` | `/rentals/:id` | Sí | Cancela; responde `422` si faltan 24 horas o menos |
| `POST` | `/rentals` | Sí | Crea una reserva (`409` si el vehículo está ocupado) |

Las rutas autenticadas esperan el encabezado `Authorization: Bearer <access_token>`.

## Estructura actual

```text
mock-api/server.mjs            → API simulada
src/
├── app/
│   ├── login/page.tsx
│   ├── mis-alquileres/page.tsx
│   └── vehiculos/page.tsx
└── components/
    ├── MyRentals.tsx          → el componente de la clase 1
    └── VehicleList.tsx
```

## Ramas

| Rama | Contenido |
| --- | --- |
| `main` | Código legado: el punto de partida |
| `clase-1-solucion` | `MyRentals` rediseñado en capas y features (solución del taller de la clase 1) |

## Para la clase 1

Antes de mirar la solución, abre `src/components/MyRentals.tsx` y responde:

1. ¿Cuántas responsabilidades tiene este componente? ¿Quién pediría cambiar cada una?
2. Si el backend renombra `start_date` a `startsAt`, ¿cuántos archivos hay que tocar?
3. Prueba a cancelar un alquiler y recarga la página. ¿Qué pasa? ¿Por qué?
4. Compara cómo `MyRentals.tsx` y `VehicleList.tsx` calculan los días y el descuento. ¿Dan el mismo resultado?
