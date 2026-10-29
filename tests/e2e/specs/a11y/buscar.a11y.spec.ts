import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';

test.describe('Accesibilidad · /buscar', () => {
  test('A11Y-BUSCAR axe wcag2a, wcag2aa, wcag22aa', async ({ page }) => {
    await page.goto('/buscar');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.locator('article').first().waitFor();
    await verificarAccesibilidad(page, 'buscar');
  });
});
