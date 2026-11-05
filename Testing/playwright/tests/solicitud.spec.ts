import { test, expect } from '@playwright/test';

// TC-E2E-04 (HU-04): enviar vacio no dispara POST; obligatorios marcados con *
test('formulario de solicitud: obligatorios marcados y bloquean envio', async ({ page }) => {
  await page.goto('/solicitud');
  await expect(page.getByText('*').first()).toBeVisible();
  const req = page
    .waitForRequest((r) => r.url().includes('/api/solicitudes') && r.method() === 'POST', { timeout: 2000 })
    .catch(() => null);
  await page.getByRole('button', { name: /enviar/i }).click();
  expect(await req).toBeNull();
});
