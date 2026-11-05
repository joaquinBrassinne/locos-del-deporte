import { test, expect } from '@playwright/test';

// TC-E2E-01 (HU-06/07/09): las rutas publicas cargan sin errores JS
for (const ruta of ['/', '/clubes', '/deportistas', '/mapa', '/buscar', '/solicitud', '/login']) {
  test(`ruta publica ${ruta} carga`, async ({ page }) => {
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(e.message));
    const r = await page.goto(ruta);
    expect(r?.status()).toBeLessThan(400);
    await expect(page.locator('body')).not.toBeEmpty();
    expect(errores).toEqual([]);
  });
}
