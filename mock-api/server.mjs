// API simulada del backend de alquiler de vehículos.
// Imita la API de NestJS que ya conocen: mismas rutas, mismo JSON en snake_case.
// No tiene dependencias: se ejecuta con `npm run api` (node mock-api/server.mjs).
//
// Usuarios de prueba:
//   ana@correo.com   / 123456
//   pedro@correo.com / 123456

import { createServer } from 'node:http';

const PORT = Number(process.env.PORT ?? 3001);
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Las fechas se generan relativas al momento en que arranca el servidor,
// para que siempre haya alquileres que se pueden cancelar y otros que no.
const now = Date.now();
const at = (offsetMs) => new Date(now + offsetMs).toISOString();

const users = [
  { id: 1, name: 'Ana Gómez', email: 'ana@correo.com', password: '123456' },
  { id: 2, name: 'Pedro Ruiz', email: 'pedro@correo.com', password: '123456' },
];

const vehicles = [
  { id: 1, plate: 'KLM482', brand_name: 'Mazda', model: 'CX-30', year: 2024, category: 'SUV', daily_rate: 150000 },
  { id: 2, plate: 'HTR915', brand_name: 'Renault', model: 'Duster', year: 2023, category: 'SUV', daily_rate: 130000 },
  { id: 3, plate: 'BQX207', brand_name: 'Kia', model: 'Picanto', year: 2022, category: 'ECONOMICO', daily_rate: 85000 },
  { id: 4, plate: 'FGT630', brand_name: 'Chevrolet', model: 'Onix', year: 2024, category: 'ECONOMICO', daily_rate: 95000 },
  { id: 5, plate: 'JNP118', brand_name: 'Toyota', model: 'Hilux', year: 2023, category: 'PICKUP', daily_rate: 240000 },
];

let nextRentalId = 108;
let rentals = [
  // Ana: uno en 3 días por 7 días (se puede cancelar, tiene descuento)
  { id: 101, user_id: 1, vehicle_id: 1, start_date: at(3 * DAY), end_date: at(10 * DAY) },
  // Ana: empieza en 20 horas (ya NO se puede cancelar)
  { id: 102, user_id: 1, vehicle_id: 3, start_date: at(20 * HOUR), end_date: at(20 * HOUR + 2 * DAY) },
  // Ana: 2 días y 1 hora (se cobran 3 días)
  { id: 103, user_id: 1, vehicle_id: 4, start_date: at(5 * DAY), end_date: at(7 * DAY + HOUR) },
  // Ana: ya empezó
  { id: 104, user_id: 1, vehicle_id: 2, start_date: at(-1 * DAY), end_date: at(4 * DAY) },
  // Ana: 10 días, en dos semanas
  { id: 105, user_id: 1, vehicle_id: 5, start_date: at(14 * DAY), end_date: at(24 * DAY) },
  // Pedro
  { id: 106, user_id: 2, vehicle_id: 2, start_date: at(6 * DAY), end_date: at(9 * DAY) },
  { id: 107, user_id: 2, vehicle_id: 1, start_date: at(30 * DAY), end_date: at(37 * DAY) },
];

// token -> userId. Tokens fijos para que sobrevivan reinicios del servidor.
const tokenFor = (user) => `token-${user.id}-${user.email}`;
const userFromToken = (token) => users.find((u) => tokenFor(u) === token);

const toRentalJson = (rental) => {
  const v = vehicles.find((x) => x.id === rental.vehicle_id);
  return {
    id: rental.id,
    vehicle_id: v.id,
    plate: v.plate,
    brand_name: v.brand_name,
    model: v.model,
    category: v.category,
    start_date: rental.start_date,
    end_date: rental.end_date,
    daily_rate: v.daily_rate,
  };
};

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

// ---------------------------------------------------------------------------

const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve(null);
      }
    });
  });

const authenticate = (req) => {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token || token === 'null') return null;
  return userFromToken(token) ?? null;
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const log = (status) => console.log(`${req.method} ${req.url} → ${status}`);

  if (req.method === 'OPTIONS') return send(res, 204);

  // POST /auth/login
  if (req.method === 'POST' && path === '/auth/login') {
    const body = await readBody(req);
    const user = users.find((u) => u.email === body?.email && u.password === body?.password);
    if (!user) {
      log(401);
      return send(res, 401, { statusCode: 401, message: 'Credenciales inválidas' });
    }
    log(201);
    return send(res, 201, { access_token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email } });
  }

  // GET /vehicles?from=ISO&to=ISO  (público; si llegan fechas, filtra disponibles)
  if (req.method === 'GET' && path === '/vehicles') {
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    let list = vehicles;
    if (from && to) {
      const f = Date.parse(from);
      const t = Date.parse(to);
      list = vehicles.filter(
        (v) =>
          !rentals.some(
            (r) => r.vehicle_id === v.id && overlaps(f, t, Date.parse(r.start_date), Date.parse(r.end_date)),
          ),
      );
    }
    log(200);
    return send(res, 200, list);
  }

  // A partir de aquí, todo requiere token.
  const user = authenticate(req);
  if (!user) {
    log(401);
    return send(res, 401, { statusCode: 401, message: 'No autenticado' });
  }

  // GET /rentals/me
  if (req.method === 'GET' && path === '/rentals/me') {
    log(200);
    return send(
      res,
      200,
      rentals
        .filter((r) => r.user_id === user.id)
        .sort((a, b) => Date.parse(a.start_date) - Date.parse(b.start_date))
        .map(toRentalJson),
    );
  }

  // DELETE /rentals/:id
  const deleteMatch = path.match(/^\/rentals\/(\d+)$/);
  if (req.method === 'DELETE' && deleteMatch) {
    const id = Number(deleteMatch[1]);
    const rental = rentals.find((r) => r.id === id && r.user_id === user.id);
    if (!rental) {
      log(404);
      return send(res, 404, { statusCode: 404, message: 'Alquiler no encontrado' });
    }
    if (Date.parse(rental.start_date) - Date.now() <= DAY) {
      log(422);
      return send(res, 422, {
        statusCode: 422,
        message: 'Solo se puede cancelar con más de 24 horas de anticipación',
      });
    }
    rentals = rentals.filter((r) => r.id !== id);
    log(204);
    return send(res, 204);
  }

  // POST /rentals  { vehicle_id, start_date, end_date }  (se usa desde la sesión 6)
  if (req.method === 'POST' && path === '/rentals') {
    const body = await readBody(req);
    const vehicle = vehicles.find((v) => v.id === body?.vehicle_id);
    const start = Date.parse(body?.start_date);
    const end = Date.parse(body?.end_date);
    if (!vehicle || Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      log(400);
      return send(res, 400, { statusCode: 400, message: 'Datos de la reserva inválidos' });
    }
    const taken = rentals.some(
      (r) => r.vehicle_id === vehicle.id && overlaps(start, end, Date.parse(r.start_date), Date.parse(r.end_date)),
    );
    if (taken) {
      log(409);
      return send(res, 409, { statusCode: 409, message: 'El vehículo no está disponible en esas fechas' });
    }
    const rental = {
      id: nextRentalId++,
      user_id: user.id,
      vehicle_id: vehicle.id,
      start_date: new Date(start).toISOString(),
      end_date: new Date(end).toISOString(),
    };
    rentals.push(rental);
    log(201);
    return send(res, 201, toRentalJson(rental));
  }

  log(404);
  return send(res, 404, { statusCode: 404, message: `Ruta no encontrada: ${req.method} ${path}` });
});

server.listen(PORT, () => {
  console.log(`API simulada en http://localhost:${PORT}`);
  console.log('Usuarios: ana@correo.com / 123456 · pedro@correo.com / 123456');
});
