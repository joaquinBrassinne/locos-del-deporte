import { expect, test } from '@playwright/test';
import { verificarAccesibilidad } from '../../fixtures/axe';

test.describe('Accesibilidad · /solicitud', () => {
  test('A11Y-SOLICITUD axe formulario de club', async ({ page }) => {
    await page.goto('/solicitud');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await verificarAccesibilidad(page, 'solicitud-club');
  });

  test('A11Y-SOLICITUD axe formulario de deportista', async ({ page }) => {
    await page.goto('/solicitud');
    await page.getByRole('tab', { name: /SOY DEPORTISTA/ }).click();
    await expect(page.getByRole('tab', { name: /SOY DEPORTISTA/ })).toHaveAttribute('aria-selected', 'true');
    await verificarAccesibilidad(page, 'solicitud-deportista');
  });

  // Mensajes de error: se envía el formulario vacío para que aparezcan las validaciones.
  test('A11Y-SOLICITUD axe con mensajes de error de validación', async ({ page }) => {
    await page.goto('/solicitud');
    await page.getByRole('button', { name: /ENVIAR SOLICITUD/ }).click();
    await verificarAccesibilidad(page, 'solicitud-errores');
  });
});
