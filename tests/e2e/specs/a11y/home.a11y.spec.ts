import { test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';
import { HomePage } from '../../pages/HomePage';

test.describe('Accesibilidad · Home (/)', () => {
  test('A11Y-HOME axe wcag2a, wcag2aa, wcag22aa', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.estadisticas(); // espera a que los contadores dejen de mostrar «—»
    await page.locator('#deportistas article').first().waitFor();
    await verificarAccesibilidad(page, 'home');
  });
});
