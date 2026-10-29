import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';

test.describe('Accesibilidad · /login', () => {
  test('A11Y-LOGIN axe wcag2a, wcag2aa, wcag22aa', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Acceso Administrativo' })).toBeVisible();
    await verificarAccesibilidad(page, 'login');
  });

  test('A11Y-LOGIN axe con mensaje de error de credenciales', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Usuario').fill('usuarioInventado');
    await page.getByPlaceholder('Contraseña').fill('incorrecta');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page.getByText(/incorrect|inválid|error/i).first()).toBeVisible();
    await verificarAccesibilidad(page, 'login-error');
  });
});
