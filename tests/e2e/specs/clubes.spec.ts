import { expect, test } from '@playwright/test';
import { ClubesPage } from '../pages/ClubesPage';
import { CLUBES_DS01, TODOS_LOS_CLUBES } from '../fixtures/datos';

// Flujo 1 · Listar y buscar clubes (HU-01, HU-03). Parte de DS-01 y es de solo lectura:
// no crea datos, por lo que no hay nada que limpiar.
const { atleticoRioTercero, nauticoRioTercero, atleticoSur } = CLUBES_DS01;
const ATLETICO = [atleticoRioTercero, atleticoSur];

interface Caso {
  id: string;
  clase: string;
  termino: string;
  esperados: readonly string[];
}

// Clases de equivalencia y valores límite del término de búsqueda.
// Los esperados salen de DS-01 y de los CA de la HU-03, no del comportamiento actual.
const casos: Caso[] = [
  // Clase: coincide con el nombre (TC-VP-03)
  { id: 'TC-VP-03', clase: 'nombre exacto', termino: 'Club Atlético', esperados: ATLETICO },
  { id: 'TC-VP-03', clase: 'nombre sin tilde', termino: 'Club Atletico', esperados: ATLETICO },
  { id: 'TC-VP-03', clase: 'fragmento en medio del nombre', termino: 'Tercero', esperados: [atleticoRioTercero, nauticoRioTercero] },
  { id: 'TC-VP-03', clase: 'resultado único', termino: 'Sur', esperados: [atleticoSur] },
  // Clase: mayúsculas/minúsculas (TC-VP-12, CA-3.4)
  { id: 'TC-VP-12', clase: 'minúsculas', termino: 'club atlético', esperados: ATLETICO },
  { id: 'TC-VP-12', clase: 'mayúsculas', termino: 'CLUB ATLÉTICO', esperados: ATLETICO },
  { id: 'TC-VP-12', clase: 'mayúsculas sin tilde', termino: 'CLUB ATLETICO', esperados: ATLETICO },
  // Clase: coincide con la disciplina (TC-VP-11, CA-3.2)
  { id: 'TC-VP-11', clase: 'disciplina con tilde', termino: 'Natación', esperados: [nauticoRioTercero] },
  { id: 'TC-VP-11', clase: 'disciplina sin tilde', termino: 'natacion', esperados: [nauticoRioTercero] },
  // Valores límite del largo del término (TC-VP-14)
  { id: 'TC-VP-14', clase: 'límite: vacío (0 caracteres)', termino: '', esperados: TODOS_LOS_CLUBES },
  { id: 'TC-VP-14', clase: 'límite: solo espacios', termino: '   ', esperados: TODOS_LOS_CLUBES },
  { id: 'TC-VP-14', clase: 'límite: 1 carácter que coincide', termino: 'u', esperados: TODOS_LOS_CLUBES },
  { id: 'TC-VP-14', clase: 'espacios alrededor del término', termino: '  Sur  ', esperados: [atleticoSur] },
  // Clase: sin coincidencias (TC-VP-04, TC-VP-13, CA-3.5)
  { id: 'TC-VP-04', clase: 'texto inexistente', termino: 'xxxxxxxxxxx', esperados: [] },
  { id: 'TC-VP-13', clase: 'club pendiente (CA-3.5)', termino: 'Club Pendiente', esperados: [] },
  { id: 'TC-VP-13', clase: 'segundo club pendiente', termino: 'Club Pendiente Dos', esperados: [] },
  // Clase: entradas especiales (TC-VP-15, CA-3.6)
  { id: 'TC-VP-15', clase: 'inyección SQL', termino: "' OR 1=1 --", esperados: [] },
  { id: 'TC-VP-15', clase: 'caracteres especiales', termino: '@#$%&*', esperados: [] },
  { id: 'TC-VP-15', clase: 'HTML/script', termino: '<script>alert(1)</script>', esperados: [] },
  { id: 'TC-VP-15', clase: 'límite superior: 300 caracteres', termino: 'a'.repeat(300), esperados: [] },
];

test.describe('Flujo 1 · Clubes: listar y buscar', () => {
  let clubes: ClubesPage;

  test.beforeEach(async ({ page }) => {
    clubes = new ClubesPage(page);
    await clubes.goto();
  });

  test('TC-VP-01 Lista exactamente los 3 clubes aprobados, sin login y sin pendientes', async () => {
    await clubes.expectNombres(TODOS_LOS_CLUBES);
    for (const pendiente of ['Club Pendiente Uno', 'Club Pendiente Dos']) {
      await expect(clubes.tarjeta(pendiente)).toHaveCount(0);
    }
  });

  for (const c of casos) {
    test(`${c.id} Buscar «${c.termino.length > 40 ? c.termino.slice(0, 40) + '…' : c.termino}» · ${c.clase}`, async ({ page }) => {
      const errores: string[] = [];
      page.on('pageerror', (e) => errores.push(e.message));
      page.on('dialog', async (d) => {
        errores.push(`diálogo inesperado: ${d.message()}`);
        await d.dismiss();
      });

      await clubes.buscar(c.termino);
      await clubes.expectNombres(c.esperados);

      expect(errores, 'La búsqueda no debe generar errores de página ni diálogos').toEqual([]);
    });
  }

  // CA-3.3 / TC-VP-04: el mensaje esperado lleva punto final.
  test('TC-VP-04 El mensaje de sin resultados es exactamente «No se encontraron clubes.»', async () => {
    await clubes.buscar('xxxxxxxxxxx');
    await expect(clubes.sinResultados).toHaveText('No se encontraron clubes.');
  });

  test('TC-VP-14 Borrar el texto después de buscar vuelve a mostrar los 3 clubes', async () => {
    await clubes.buscar('Club Atlético');
    await clubes.expectNombres(ATLETICO);
    await clubes.limpiarBusqueda();
    await clubes.expectNombres(TODOS_LOS_CLUBES);
  });

  test('TC-VP-15 La búsqueda no dispara peticiones fallidas al backend (nunca 500)', async ({ page }) => {
    const fallidas: string[] = [];
    page.on('response', (r) => {
      if (r.url().includes(':8080') && r.status() >= 400) fallidas.push(`${r.status()} ${r.url()}`);
    });
    for (const termino of ["' OR 1=1 --", '@#$%&*', '<script>alert(1)</script>']) {
      await clubes.buscar(termino);
      await clubes.expectNombres([]);
    }
    expect(fallidas).toEqual([]);
  });
});
