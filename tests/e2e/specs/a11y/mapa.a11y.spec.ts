import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';

test.describe('Accesibilidad · /mapa', () => {
  test('A11Y-MAPA axe wcag2a, wcag2aa, wcag22aa', async ({ page }) => {
    await page.goto('/mapa');
    await expect(page.locator('.leaflet-container').first()).toBeVisible();
    // Los tiles vienen de internet: se espera a que haya al menos uno cargado.
    await page.locator('.leaflet-tile-loaded').first().waitFor({ timeout: 15_000 }).catch(() => undefined);
    await verificarAccesibilidad(page, 'mapa');
  });
});
