// Carga los datos de prueba base DS-01 (Plan de Pruebas v1.1) usando la API del backend.
// Uso: node tests/postman/seed-ds01.js   (BD limpia; variables opcionales: BASE_URL, ADMIN_USER, ADMIN_PASSWORD)
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const ADMIN_USER = process.env.ADMIN_USER || 'AdminRoot';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'locos1234';

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64'),
};

async function post(path, body) {
  const res = await fetch(BASE_URL + path, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

// [nombreInstitucion, direccion, disciplinas, deporteAdaptado, aprobado]
const clubes = [
  ['Club Atlético Río Tercero', 'Av. San Martín 100', 'Fútbol', false, true],
  ['Club Náutico Río Tercero', 'Costanera 250', 'Natación', true, true],
  ['Club Atlético Sur', 'Calle Belgrano 45', 'Básquet', false, true],
  ['Club Pendiente Uno', 'Calle Test 1', 'Vóley', false, false],
  ['Club Pendiente Dos', 'Calle Test 2', 'Fútbol', false, false],
];

// [nombre, deporte, logros, aprobado]
const deportistas = [
  ['Lucía Pérez', 'Fútbol', 'Campeona Liga Regional 2025', true],
  ['Mateo Gómez', 'Básquet', 'MVP Torneo Provincial 2025', true],
  ['Sofía Díaz', 'Fútbol', 'Goleadora Copa Ciudad 2024', true],
  ['Tomás Ruiz', 'Natación', 'Medalla de plata 2025', true],
  ['Valentina Cruz', 'Vóley', 'Subcampeona Torneo Local 2025', false],
];

(async () => {
  for (const [nombreInstitucion, direccion, disciplinas, deporteAdaptado, aprobado] of clubes) {
    const datos = { nombreInstitucion, direccion, telefono: '3571000000', email: 'club@test.com', disciplinas, deporteAdaptado, fotos: [] };
    const solicitud = await post('/api/solicitudes', { tipo: 'CLUB', datosAdjuntos: JSON.stringify(datos) });
    if (aprobado) await post(`/api/admin/club/${solicitud.id}`, datos);
  }
  for (const [nombre, deporte, logros, aprobado] of deportistas) {
    const datos = { nombre, deporte, edad: 25, historia: 'Historia de prueba', logros, deporteAdaptado: false, fotos: [], clubId: null };
    const solicitud = await post('/api/solicitudes', { tipo: 'DEPORTISTA', datosAdjuntos: JSON.stringify(datos) });
    if (aprobado) await post(`/api/admin/deportista/${solicitud.id}`, datos);
  }
  console.log('DS-01 cargado: 3 clubes y 4 deportistas aprobados, 2 clubes y 1 deportista pendientes');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
