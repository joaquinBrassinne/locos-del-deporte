import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';

const ADMIN_USER = process.env.ADMIN_USER ?? 'AdminRoot';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'locos1234';

test.describe('Accesibilidad · /admin (requiere sesión)', () => {
  // El login del frontend guarda btoa("usuario:password") en localStorage.adminToken.
  test.beforeEach(async ({ page }) => {
    const token = Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64');
    await page.addInitScript((t) => localStorage.setItem('adminToken', t), token);
  });

  test('A11Y-ADMIN axe solicitudes pendientes', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('button', { name: /Solicitudes de Espacios/ })).toBeVisible();
    await page.waitForLoadState('networkidle');
    await verificarAccesibilidad(page, 'admin-solicitudes');
  });

  test('A11Y-ADMIN axe gestión de perfiles', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('button', { name: /Gestión de Perfiles/ }).click();
    await page.waitForLoadState('networkidle');
    await verificarAccesibilidad(page, 'admin-gestion');
  });
});
