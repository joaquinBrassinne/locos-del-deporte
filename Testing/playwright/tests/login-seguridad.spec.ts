import { test, expect } from '@playwright/test';

const entrar = (page: import('@playwright/test').Page) =>
  page.getByRole('button').filter({ hasText: /ingresar|entrar|iniciar|acceder/i }).click();

// TC-SEC-E2E-01: /admin sin sesion no debe mostrar el panel
test('admin sin login redirige a /login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/login/);
});

// TC-E2E-02 (HU-01): credenciales invalidas no entran
test('login con credenciales invalidas no entra', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Usuario').fill('AdminRoot');
  await page.getByPlaceholder('Contraseña').fill('incorrecta');
  await entrar(page);
  await expect(page).not.toHaveURL(/\/admin/);
});

// TC-E2E-03 (HU-01): login valido
test('login valido entra al panel', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder('Usuario').fill('AdminRoot');
  await page.getByPlaceholder('Contraseña').fill('locos1234');
  await entrar(page);
  await expect(page).toHaveURL(/\/admin/);
});
