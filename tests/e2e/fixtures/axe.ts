import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const TAGS_WCAG = ['wcag2a', 'wcag2aa', 'wcag22aa'];

const REPORTES = path.resolve(__dirname, '../../a11y/reports');

/**
 * Corre axe con las etiquetas wcag2a, wcag2aa y wcag22aa sobre el estado actual de la página,
 * guarda el resultado completo en tests/a11y/reports/axe-<nombre>.json y exige 0 violaciones.
 * El esperado es «sin violaciones»: no se ajusta a lo que hoy devuelve el sistema.
 */
export async function verificarAccesibilidad(page: Page, nombre: string): Promise<void> {
  const resultados = await new AxeBuilder({ page }).withTags(TAGS_WCAG).analyze();

  mkdirSync(REPORTES, { recursive: true });
  writeFileSync(path.join(REPORTES, `axe-${nombre}.json`), JSON.stringify(resultados, null, 2));

  const resumen = resultados.violations.map(
    (v) => `${v.id} [${v.impact}] ${v.nodes.length} nodo(s): ${v.help}`,
  );
  expect(resumen, `Violaciones de accesibilidad en «${nombre}» (detalle en tests/a11y/reports/axe-${nombre}.json)`).toEqual([]);
}
