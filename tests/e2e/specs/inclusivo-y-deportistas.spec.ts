import { expect, test } from '../fixtures/api';
import { ClubesPage } from '../pages/ClubesPage';
import { DeportistasPage } from '../pages/DeportistasPage';
import { CLUBES_DS01, DEPORTISTAS_DS01, TODOS_LOS_CLUBES, TODOS_LOS_DEPORTISTAS, deportistaDatos, unico } from '../fixtures/datos';

// Flujo 2 · Filtro «Deporte Inclusivo» (HU-04) y búsqueda de deportistas sin tilde (HU-09).
const { lucia, mateo, sofia, tomas } = DEPORTISTAS_DS01;
const { atleticoRioTercero, nauticoRioTercero, atleticoSur } = CLUBES_DS01;

test.describe('Flujo 2a · Filtro «Deporte Inclusivo / Adaptado» en /clubes', () => {
  let clubes: ClubesPage;

  test.beforeEach(async ({ page }) => {
    clubes = new ClubesPage(page);
    await clubes.goto();
  });

  test('TC-VP-05 Activar el filtro muestra solo el club con deporteAdaptado=true', async () => {
    await clubes.activarInclusivo();
    await clubes.expectNombres([nauticoRioTercero]);
  });

  test('TC-VP-06 Desactivar el filtro vuelve a mostrar los 3 clubes', async () => {
    await clubes.activarInclusivo();
    await clubes.expectNombres([nauticoRioTercero]);
    await clubes.desactivarInclusivo();
    await clubes.expectNombres(TODOS_LOS_CLUBES);
  });

  test('TC-VP-16 Filtro inclusivo combinado con búsqueda por nombre (tabla de decisión)', async () => {
    await clubes.activarInclusivo();
    await clubes.buscar('Club Atlético');
    await clubes.expectNombres([]); // ningún club inclusivo contiene «Club Atlético»
    await clubes.desactivarInclusivo();
    await clubes.expectNombres([atleticoRioTercero, atleticoSur]);
  });

  test('TC-VP-16 Filtro inclusivo + búsqueda que sí coincide con el club inclusivo', async () => {
    await clubes.activarInclusivo();
    await clubes.buscar('Náutico');
    await clubes.expectNombres([nauticoRioTercero]);
  });
});

interface CasoDeportista {
  id: string;
  clase: string;
  termino: string;
  esperados: readonly string[];
}

// Clases de equivalencia y valores límite para la búsqueda de deportistas (DS-01).
const casosDeportistas: CasoDeportista[] = [
  { id: 'TC-VP-07', clase: 'deporte con tilde', termino: 'Fútbol', esperados: [lucia, sofia] },
  { id: 'TC-VP-10', clase: 'deporte sin tilde (CA-9.2)', termino: 'Futbol', esperados: [lucia, sofia] },
  { id: 'TC-VP-10', clase: 'deporte en minúsculas sin tilde', termino: 'futbol', esperados: [lucia, sofia] },
  { id: 'TC-VP-10', clase: 'deporte en mayúsculas con tilde', termino: 'FÚTBOL', esperados: [lucia, sofia] },
  { id: 'TC-VP-07', clase: 'otro deporte con tilde', termino: 'Natación', esperados: [tomas] },
  { id: 'TC-VP-10', clase: 'otro deporte sin tilde', termino: 'natacion', esperados: [tomas] },
  { id: 'TC-VP-10', clase: 'Básquet sin tilde', termino: 'basquet', esperados: [mateo] },
  { id: 'TC-VP-10', clase: 'nombre sin tilde', termino: 'sofia diaz', esperados: [sofia] },
  { id: 'TC-VP-10', clase: 'nombre con tilde', termino: 'Lucía', esperados: [lucia] },
  { id: 'TC-VP-10', clase: 'apellido parcial', termino: 'ruiz', esperados: [tomas] },
  { id: 'TC-VP-14', clase: 'límite: vacío (0 caracteres)', termino: '', esperados: TODOS_LOS_DEPORTISTAS },
  { id: 'TC-VP-14', clase: 'límite: solo espacios', termino: '   ', esperados: TODOS_LOS_DEPORTISTAS },
  { id: 'TC-VP-14', clase: 'límite: 1 carácter sin coincidencias', termino: 'k', esperados: [] },
  { id: 'TC-VP-04', clase: 'deporte inexistente', termino: 'Cricket', esperados: [] },
  { id: 'TC-VP-15', clase: 'inyección SQL', termino: "' OR 1=1 --", esperados: [] },
  { id: 'TC-VP-15', clase: 'caracteres especiales', termino: '@#$%&*', esperados: [] },
  { id: 'TC-VP-15', clase: 'límite superior: 300 caracteres', termino: 'a'.repeat(300), esperados: [] },
];

test.describe('Flujo 2b · Búsqueda de deportistas (con y sin tilde)', () => {
  let deportistas: DeportistasPage;

  test.beforeEach(async ({ page }) => {
    deportistas = new DeportistasPage(page);
    await deportistas.goto();
  });

  test('TC-VP-02 Lista exactamente los 4 deportistas aprobados, sin login', async () => {
    await deportistas.expectNombres(TODOS_LOS_DEPORTISTAS);
    await expect(deportistas.tarjeta('Valentina Cruz')).toHaveCount(0); // pendiente en DS-01
  });

  for (const c of casosDeportistas) {
    test(`${c.id} Deportistas: «${c.termino.length > 40 ? c.termino.slice(0, 40) + '…' : c.termino}» · ${c.clase}`, async ({ page }) => {
      const errores: string[] = [];
      page.on('pageerror', (e) => errores.push(e.message));

      await deportistas.buscar(c.termino);
      await deportistas.expectNombres(c.esperados);

      expect(errores).toEqual([]);
    });
  }
});

test.describe('Flujo 2c · Filtro «Deporte Inclusivo / Adaptado» en /deportistas', () => {
  test('TC-VP-05 El filtro muestra solo deportistas con deporteAdaptado=true y se puede desactivar', async ({ page, api }) => {
    const nombre = unico('E2E Adaptado');
    await api.crearDeportistaAprobado(deportistaDatos(nombre, { deporteAdaptado: true, deporte: 'Natación' }));

    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await deportistas.expectNombres([...TODOS_LOS_DEPORTISTAS, nombre]);

    await deportistas.activarInclusivo();
    await deportistas.expectNombres([nombre]);

    await deportistas.desactivarInclusivo();
    await deportistas.expectNombres([...TODOS_LOS_DEPORTISTAS, nombre]);
  });

  test('TC-VP-16 Filtro inclusivo + búsqueda sin tilde del deporte del deportista adaptado', async ({ page, api }) => {
    const nombre = unico('E2E Adaptado');
    await api.crearDeportistaAprobado(deportistaDatos(nombre, { deporteAdaptado: true, deporte: 'Natación' }));

    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await deportistas.activarInclusivo();
    await deportistas.buscar('natacion'); // «Natación» sin tilde: también existe Tomás Ruiz, pero no es adaptado
    await deportistas.expectNombres([nombre]);
  });
});
