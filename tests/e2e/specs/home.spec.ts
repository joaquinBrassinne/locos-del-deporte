import { expect, test } from '../fixtures/api';
import { HomePage } from '../pages/HomePage';
import { DEPORTISTAS_DS01, TODOS_LOS_DEPORTISTAS, clubDatos, unico } from '../fixtures/datos';

const { lucia, sofia } = DEPORTISTAS_DS01;

test.describe('Home · estadísticas y pills', () => {
  test('TC-VP-08 Los 4 contadores coinciden con DS-01 (3 clubes, 4 deportistas, 3 disciplinas, 1 inclusivo)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    expect(await home.estadisticas()).toEqual({
      Clubes: 3,
      Deportistas: 4,
      Disciplinas: 3,
      'Deporte Inclusivo': 1,
    });
  });

  test('TC-VP-09 La pill «Fútbol» muestra solo a Lucía Pérez y Sofía Díaz', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect.poll(() => home.deportistasDestacados()).toEqual(expect.arrayContaining(TODOS_LOS_DEPORTISTAS));
    await home.elegirPillDeportistas('Fútbol');
    await expect.poll(async () => (await home.deportistasDestacados()).sort()).toEqual([lucia, sofia].sort());
  });

  // Valor límite: el contador de disciplinas solo sube si la disciplina es nueva (Pádel no está en DS-01).
  test('TC-VP-08 Un club inclusivo con disciplina nueva suma +1 a Clubes, Disciplinas e Inclusivo', async ({ page, api }) => {
    const home = new HomePage(page);
    await home.goto();
    const antes = await home.estadisticas();

    await api.crearClubAprobado(
      clubDatos(unico('E2E Club Home'), { disciplinas: 'Pádel', deporteAdaptado: true }),
    );

    await home.goto();
    const despues = await home.estadisticas();
    expect(despues).toEqual({
      Clubes: antes.Clubes + 1,
      Deportistas: antes.Deportistas,
      Disciplinas: antes.Disciplinas + 1,
      'Deporte Inclusivo': antes['Deporte Inclusivo'] + 1,
    });
  });
});
