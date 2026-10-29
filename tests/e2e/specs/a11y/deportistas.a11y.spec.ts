import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';
import { DeportistasPage } from '../../pages/DeportistasPage';

test.describe('Accesibilidad · /deportistas', () => {
  test('A11Y-DEPORTISTAS axe wcag2a, wcag2aa, wcag22aa (listado)', async ({ page }) => {
    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await expect(deportistas.tarjetas.first()).toBeVisible();
    await verificarAccesibilidad(page, 'deportistas');
  });

  test('A11Y-DEPORTISTAS axe con el modal de perfil abierto', async ({ page }) => {
    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await deportistas.tarjetas.first().getByRole('button', { name: /Ver perfil/ }).click();
    // El modal no tiene role="dialog" (ver informe): se lo ubica por su overlay.
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
    await verificarAccesibilidad(page, 'deportistas-modal');
  });

  test('A11Y-DEPORTISTAS axe sin resultados', async ({ page }) => {
    const deportistas = new DeportistasPage(page);
    await deportistas.goto();
    await deportistas.buscar('Cricket');
    await expect(deportistas.sinResultados).toBeVisible();
    await verificarAccesibilidad(page, 'deportistas-sin-resultados');
  });
});
