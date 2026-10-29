import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';
import { ClubesPage } from '../../pages/ClubesPage';

test.describe('Accesibilidad · /clubes', () => {
  test('A11Y-CLUBES axe wcag2a, wcag2aa, wcag22aa (listado)', async ({ page }) => {
    const clubes = new ClubesPage(page);
    await clubes.goto();
    await expect(clubes.tarjetas.first()).toBeVisible();
    await verificarAccesibilidad(page, 'clubes');
  });

  test('A11Y-CLUBES axe con el modal de detalle abierto', async ({ page }) => {
    const clubes = new ClubesPage(page);
    await clubes.goto();
    await clubes.tarjetas.first().getByRole('button', { name: /Ver más/ }).click();
    // El modal no tiene role="dialog" (ver informe): se lo ubica por su overlay.
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    await verificarAccesibilidad(page, 'clubes-modal');
  });

  test('A11Y-CLUBES axe sin resultados', async ({ page }) => {
    const clubes = new ClubesPage(page);
    await clubes.goto();
    await clubes.buscar('xxxxxxxxxxx');
    await expect(clubes.sinResultados).toBeVisible();
    await verificarAccesibilidad(page, 'clubes-sin-resultados');
  });
});
