import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Cada violacion encontrada => un Issue con label "accesibilidad".
for (const ruta of ['/', '/solicitud', '/login']) {
  test(`a11y ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    console.log(ruta, r.violations.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}`));
    expect(r.violations).toEqual([]);
  });
}
