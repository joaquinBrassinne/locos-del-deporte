import { expect, type Locator, type Page } from '@playwright/test';

export type Estadistica = 'Clubes' | 'Deportistas' | 'Disciplinas' | 'Deporte Inclusivo';

export type Estadisticas = Record<Estadistica, number>;

/** Pantalla / (home): estadísticas y pills de deportistas/clubes destacados. */
export class HomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    const respuestas = Promise.all([
      this.page.waitForResponse((r) => new URL(r.url()).pathname === '/api/clubes'),
      this.page.waitForResponse((r) => new URL(r.url()).pathname === '/api/deportistas'),
    ]);
    await this.page.goto('/');
    await respuestas;
  }

  /** Contador numérico que está justo encima de la etiqueta (div hermano anterior). */
  private contador(etiqueta: Estadistica): Locator {
    return this.page.locator(
      `xpath=//div[normalize-space(text())='${etiqueta}']/preceding-sibling::div[1]`,
    );
  }

  async estadisticas(): Promise<Estadisticas> {
    const etiquetas: Estadistica[] = ['Clubes', 'Deportistas', 'Disciplinas', 'Deporte Inclusivo'];
    const valores = {} as Estadisticas;
    for (const e of etiquetas) {
      // «—» se muestra mientras carga: esperar a que sea un número
      await expect(this.contador(e)).toHaveText(/^\d+$/);
      valores[e] = Number(await this.contador(e).innerText());
    }
    return valores;
  }

  private pillsDe(seccion: 'deportistas' | 'clubes'): Locator {
    return this.page.locator(`#${seccion}`).getByRole('button');
  }

  async elegirPillDeportistas(disciplina: string): Promise<void> {
    await this.pillsDe('deportistas').filter({ hasText: new RegExp(`^${disciplina}$`) }).click();
  }

  /** Nombres de las tarjetas de «Deportistas destacados» (máx. 6). */
  async deportistasDestacados(): Promise<string[]> {
    return (await this.page.locator('#deportistas article h3').allTextContents()).map((t) => t.trim());
  }
}
