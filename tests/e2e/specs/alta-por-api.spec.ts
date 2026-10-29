import { expect, test } from '../fixtures/api';
import { ClubesPage } from '../pages/ClubesPage';
import { DeportistasPage } from '../pages/DeportistasPage';
import {
  TODOS_LOS_CLUBES,
  TODOS_LOS_DEPORTISTAS,
  clubDatos,
  deportistaDatos,
  unico,
} from '../fixtures/datos';

// Flujo 3 · Alta por API (solicitud + aprobación del admin) y verificación en la UI.
// Cada test registra lo que crea en el fixture `api`, que lo elimina al terminar aunque falle.

test.describe('Flujo 3 · Alta por API y visibilidad en la UI', () => {
  test('TC-IT-06 Una solicitud de club PENDIENTE no aparece en /clubes', async ({ page, api }) => {
    const nombre = unico('E2E Club Pendiente');
    await api.crearSolicitud('CLUB', clubDatos(nombre));

    const clubes = new ClubesPage(page);
    await clubes.goto();
    await clubes.expectNombres(TODOS_LOS_CLUBES);
    await clubes.buscar(nombre);
    await clubes.expectNombres([]);
  });

  test('TC-IT-01 Un club aprobado (POST /api/admin/club/{id}) aparece en /clubes con sus datos', async ({ page, api }) => {
    const nombre = unico('E2E Club');
    const datos = clubDatos(nombre, { direccion: 'Av. E2E 123', disciplinas: 'Fútbol' });
    await api.crearClubAprobado(datos);

    const clubes = new ClubesPage(page);
    await clubes.goto();
    await clubes.expectNombres([...TODOS_LOS_CLUBES, nombre]);

    await clubes.buscar(nombre);
    await clubes.expectNombres([nombre]);
    const tarjeta = clubes.tarjeta(nombre);
    await expect(tarjeta).toContainText('Av. E2E 123'); // CA-1.3: dirección
    await expect(tarjeta).toContainText('Fútbol'); // CA-1.3: disciplinas
  });

  test('TC-IT-01 Un club aprobado por PATCH /api/solicitudes/{id}/aprobar (ruta del panel /admin) aparece en /clubes', async ({ page, api }) => {
    const nombre = unico('E2E Club Patch');
    const idSolicitud = await api.crearSolicitud('CLUB', clubDatos(nombre));
    await api.aprobarPorPatch(idSolicitud, 'CLUB', nombre);

    const clubes = new ClubesPage(page);
    await clubes.goto();
    await clubes.buscar(nombre);
    await clubes.expectNombres([nombre]);
  });

  test('TC-IT-02 Un deportista aprobado aparece en /deportistas con deporte y logros', async ({ page, api }) => {
    const nombre = unico('E2E Deportista');
    await api.crearDeportistaAprobado(
      deportistaDatos(nombre, { deporte: 'Natación', logros: 'Logro E2E 2026' }),
    );

    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await deportistas.expectNombres([...TODOS_LOS_DEPORTISTAS, nombre]);

    await deportistas.buscar(nombre);
    await deportistas.expectNombres([nombre]);
    const tarjeta = deportistas.tarjeta(nombre);
    await expect(tarjeta).toContainText('Natación'); // CA-2.3: deporte
    await expect(tarjeta).toContainText('Logro E2E 2026'); // CA-2.3: logros
  });

  test('TC-IT-03 Un club rechazado no aparece en /clubes, ni antes ni después de recargar', async ({ page, api }) => {
    const nombre = unico('E2E Club Rechazado');
    const idSolicitud = await api.crearSolicitud('CLUB', clubDatos(nombre));

    const clubes = new ClubesPage(page);
    await clubes.goto();
    await api.rechazar(idSolicitud, 'Documentación incompleta');
    await clubes.buscar(nombre);
    await clubes.expectNombres([]);

    await clubes.recargar();
    await clubes.expectNombres(TODOS_LOS_CLUBES);
    await clubes.buscar(nombre);
    await clubes.expectNombres([]);
  });

  // TC-IT-01 / TC-IT-02 de la planilla: la card debe aparecer SIN recargar, esperando hasta 30 s.
  test('TC-IT-01 El club aprobado aparece en /clubes ya abierto, sin recargar (hasta 30 s)', async ({ page, api }) => {
    test.setTimeout(60_000);
    const nombre = unico('E2E Club Vivo');
    const datos = clubDatos(nombre, { direccion: 'Av. Test 123' });
    const idSolicitud = await api.crearSolicitud('CLUB', datos);

    const clubes = new ClubesPage(page);
    await clubes.goto();
    await clubes.expectNombres(TODOS_LOS_CLUBES);

    await api.aprobarClub(idSolicitud, datos);

    await expect(clubes.tarjeta(nombre), 'la card debe aparecer sin recargar la página').toHaveCount(1, {
      timeout: 30_000,
    });
    await expect(clubes.tarjetas).toHaveCount(TODOS_LOS_CLUBES.length + 1);
  });

  test('TC-IT-02 El deportista aprobado aparece en /deportistas ya abierto, sin recargar (hasta 30 s)', async ({ page, api }) => {
    test.setTimeout(60_000);
    const nombre = unico('E2E Deportista Vivo');
    const datos = deportistaDatos(nombre);
    const idSolicitud = await api.crearSolicitud('DEPORTISTA', datos);

    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await deportistas.expectNombres(TODOS_LOS_DEPORTISTAS);

    await api.aprobarDeportista(idSolicitud, datos);

    await expect(deportistas.tarjeta(nombre), 'la card debe aparecer sin recargar la página').toHaveCount(1, {
      timeout: 30_000,
    });
    await expect(deportistas.tarjetas).toHaveCount(TODOS_LOS_DEPORTISTAS.length + 1);
  });
});
