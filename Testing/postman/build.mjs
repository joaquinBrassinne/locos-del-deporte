// Genera CrazySports.postman_collection.json:  node build.mjs
import fs from 'fs';
const T = (lines) => ({ listen: 'test', script: { type: 'text/javascript', exec: lines } });
const req = (name, method, path, { auth = 'basic', body, tests = [], pre } = {}) => ({
  name,
  event: [T(tests), ...(pre ? [{ listen: 'prerequest', script: { type: 'text/javascript', exec: pre } }] : [])],
  request: {
    method,
    auth: auth === 'none' ? { type: 'noauth' } : auth === 'bad' ? { type: 'basic', basic: [{ key: 'username', value: 'AdminRoot' }, { key: 'password', value: 'incorrecta' }] } : undefined,
    header: body ? [{ key: 'Content-Type', value: 'application/json' }] : [],
    body: body ? { mode: 'raw', raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2) } : undefined,
    url: { raw: '{{baseUrl}}' + path, host: ['{{baseUrl}}'], path: path.replace(/^\//, '').split('?')[0].split('/'), query: path.includes('?') ? path.split('?')[1].split('&').map(p => ({ key: p.split('=')[0], value: p.split('=')[1] })) : undefined },
  },
});
const st = (c) => `pm.test('Status ${c}', () => pm.response.to.have.status(${c}));`;
const clubOk = { nombreInstitucion: 'Club Postman', direccion: 'Calle 123', coordenadas: '-32.1712,-64.3450', disciplinas: 'Fútbol', telefono: '3571123456', email: 'club@test.com', deporteAdaptado: false };
const depOk = { nombre: 'Atleta Postman', deporte: 'Natación', edad: 20, email: 'a@test.com', telefono: '3571123456' };
const solClub = { tipo: 'CLUB', datosAdjuntos: JSON.stringify(clubOk) };
const saveId = ['const j = pm.response.json();', "pm.collectionVariables.set('solicitudId', j.id);", "pm.test('Devuelve id', () => pm.expect(j.id).to.exist);"];

const folders = [
  ['01 - Públicos (HU-06, HU-07, HU-09)', [
    req('GET clubes', 'GET', '/api/clubes', { auth: 'none', tests: [st(200), "pm.test('Es array', () => pm.expect(pm.response.json()).to.be.an('array'));"] }),
    req('GET deportistas', 'GET', '/api/deportistas', { auth: 'none', tests: [st(200)] }),
    req('GET clubes buscar', 'GET', '/api/clubes/buscar?nombre=club', { auth: 'none', tests: [st(200)] }),
    req('GET clubes adaptado', 'GET', '/api/clubes/adaptado', { auth: 'none', tests: [st(200)] }),
    req('GET deportistas adaptado', 'GET', '/api/deportistas/adaptado', { auth: 'none', tests: [st(200)] }),
    req('GET club inexistente', 'GET', '/api/clubes/999999', { auth: 'none', tests: ["pm.test('404 esperado', () => pm.response.to.have.status(404));"] }),
  ]],
  ['02 - Solicitudes (HU-04)', [
    req('POST solicitud CLUB válida (público)', 'POST', '/api/solicitudes', { auth: 'none', body: solClub, tests: [st(201), ...saveId] }),
    req('POST solicitud sin tipo', 'POST', '/api/solicitudes', { auth: 'none', body: { datosAdjuntos: '{}' }, tests: [st(400)] }),
    req('POST solicitud sin datosAdjuntos', 'POST', '/api/solicitudes', { auth: 'none', body: { tipo: 'CLUB' }, tests: [st(400)] }),
    req('GET solicitudes SIN credenciales', 'GET', '/api/solicitudes', { auth: 'none', tests: [st(401)] }),
    req('GET solicitudes pendientes (admin)', 'GET', '/api/solicitudes?estado=PENDIENTE', { tests: [st(200)] }),
    req('GET solicitud por id (admin)', 'GET', '/api/solicitudes/{{solicitudId}}', { tests: [st(200)] }),
  ]],
  ['03 - Admin: moderación (HU-01)', [
    req('PATCH aprobar solicitud', 'PATCH', '/api/solicitudes/{{solicitudId}}/aprobar', { tests: [st(200)] }),
    req('PUT rechazar solicitud', 'PUT', '/api/admin/rechazar/{{solicitudId}}/Datos incompletos', { tests: ["pm.test('2xx/4xx controlado', () => pm.expect(pm.response.code).to.be.oneOf([200,400,404,409]));"] }),
    req('POST crear club (admin)', 'POST', '/api/clubes', { body: clubOk, tests: [st(201), "pm.collectionVariables.set('clubId', pm.response.json().id);"] }),
    req('PUT editar club', 'PUT', '/api/clubes/{{clubId}}', { body: { ...clubOk, nombreInstitucion: 'Club Editado' }, tests: [st(200)] }),
    req('DELETE club', 'DELETE', '/api/clubes/{{clubId}}', { tests: ["pm.test('204/200', () => pm.expect(pm.response.code).to.be.oneOf([200,204]));"] }),
  ]],
  ['04 - Validación de campos (BUGS ESPERADOS: deben dar 400)', [
    req('Club nombre 256 chars → 400 (hoy 500)', 'POST', '/api/clubes', { body: { ...clubOk, nombreInstitucion: 'A'.repeat(256) }, tests: [st(400)] }),
    req('Club email inválido → 400 (hoy 201)', 'POST', '/api/clubes', { body: { ...clubOk, email: 'sin-arroba' }, tests: [st(400)] }),
    req('Club teléfono con letras → 400 (hoy 201)', 'POST', '/api/clubes', { body: { ...clubOk, telefono: '35710ABCDE' }, tests: [st(400)] }),
    req('Club nombre vacío → 400', 'POST', '/api/clubes', { body: { ...clubOk, nombreInstitucion: '' }, tests: [st(400)] }),
    req('Deportista edad 0 → 400', 'POST', '/api/deportistas', { body: { ...depOk, edad: 0 }, tests: [st(400)] }),
    req('Deportista edad -1 → 400', 'POST', '/api/deportistas', { body: { ...depOk, edad: -1 }, tests: [st(400)] }),
    req('Deportista edad 1 → 201 (límite válido)', 'POST', '/api/deportistas', { body: { ...depOk, edad: 1 }, tests: [st(201)] }),
    req('Deportista edad 150 → 400 (hoy 201, falta @Max)', 'POST', '/api/deportistas', { body: { ...depOk, edad: 150 }, tests: [st(400)] }),
    req('Deportista email inválido → 400', 'POST', '/api/deportistas', { body: { ...depOk, email: 'xx' }, tests: [st(400)] }),
  ]],
  ['05 - Seguridad', [
    req('POST club SIN auth → 401', 'POST', '/api/clubes', { auth: 'none', body: clubOk, tests: [st(401)] }),
    req('DELETE club SIN auth → 401', 'DELETE', '/api/clubes/1', { auth: 'none', tests: [st(401)] }),
    req('PUT club SIN auth → 401', 'PUT', '/api/clubes/1', { auth: 'none', body: clubOk, tests: [st(401)] }),
    req('Admin SIN auth → 401', 'POST', '/api/admin/club/1', { auth: 'none', body: clubOk, tests: [st(401)] }),
    req('Credenciales incorrectas → 401', 'GET', '/api/solicitudes', { auth: 'bad', tests: [st(401)] }),
    req('SQLi en buscar → sin 500 ni fuga', 'GET', "/api/clubes/buscar?nombre=' OR '1'='1", { auth: 'none', tests: ["pm.test('No 500', () => pm.expect(pm.response.code).to.be.below(500));", "pm.test('No devuelve todo por inyección', () => pm.expect(pm.response.text()).to.not.include('syntax error'));"] }),
    req('XSS almacenado en solicitud', 'POST', '/api/solicitudes', { auth: 'none', body: { tipo: 'CLUB', datosAdjuntos: '{"nombreInstitucion":"<script>alert(1)</script>"}' }, tests: ["pm.test('Aceptado o rechazado, nunca 500', () => pm.expect(pm.response.code).to.be.below(500));", "pm.test('Anotar: el front debe escapar', () => true);"] }),
    req('Swagger expuesto (informativo)', 'GET', '/swagger-ui/index.html', { auth: 'none', tests: ["pm.test('Informativo: Swagger público ' + pm.response.code, () => true);"] }),
  ]],
];
const col = {
  info: { name: 'CrazySports API', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  auth: { type: 'basic', basic: [{ key: 'username', value: '{{adminUser}}' }, { key: 'password', value: '{{adminPass}}' }] },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:8080' }, { key: 'adminUser', value: 'AdminRoot' }, { key: 'adminPass', value: 'locos1234' },
    { key: 'solicitudId', value: '1' }, { key: 'clubId', value: '1' },
  ],
  item: folders.map(([name, item]) => ({ name, item })),
};
fs.writeFileSync(new URL('./CrazySports.postman_collection.json', import.meta.url), JSON.stringify(col, null, 2));
console.log('OK');
