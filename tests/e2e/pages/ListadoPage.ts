import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Comportamiento común de /clubes y /deportistas: buscador, toggle «Deporte Inclusivo / Adaptado»
 * y tarjetas (<article>). El filtrado es en el cliente: el listado se baja una vez al montar la
 * página y luego se filtra en memoria.
 */
export abstract class ListadoPage {
  protected abstract readonly ruta: string;
  protected abstract readonly apiPath: string;
  protected abstract readonly placeholderBuscador: string;
  protected abstract readonly textoSinResultados: RegExp;

  constructor(protected readonly page: Page) {}

  // Getters (no campos): las subclases definen sus constantes después del constructor del padre.
  get tarjetas(): Locator {
    return this.page.locator('article');
  }

  get buscador(): Locator {
    return this.page.getByPlaceholder(this.placeholderBuscador);
  }

  /** El switch es un <div> clickeable dentro de un <label for="toggle-adaptado"> sin <input>. */
  get toggleInclusivo(): Locator {
    return this.page.locator('label[for="toggle-adaptado"] > div');
  }

  get sinResultados(): Locator {
    return this.page.getByRole('heading', { name: this.textoSinResultados });
  }

  /** Abre la pantalla y espera a que el backend responda el listado. */
  async goto(): Promise<void> {
    const listado = this.page.waitForResponse(
      (r) => new URL(r.url()).pathname === this.apiPath && r.request().method() === 'GET',
    );
    await this.page.goto(this.ruta);
    await listado;
    await this.buscador.waitFor();
  }

  async recargar(): Promise<void> {
    const listado = this.page.waitForResponse(
      (r) => new URL(r.url()).pathname === this.apiPath && r.request().method() === 'GET',
    );
    await this.page.reload();
    await listado;
  }

  /** Escribe en el buscador (filtra en vivo) y confirma con Enter. */
  async buscar(texto: string): Promise<void> {
    await this.buscador.fill(texto);
    await this.buscador.press('Enter');
  }

  async limpiarBusqueda(): Promise<void> {
    await this.buscador.fill('');
    await this.buscador.press('Enter');
  }

  async activarInclusivo(): Promise<void> {
    await this.toggleInclusivo.click();
    await expect(this.toggleInclusivo).toHaveClass(/bg-emerald-500/);
  }

  async desactivarInclusivo(): Promise<void> {
    await this.toggleInclusivo.click();
    await expect(this.toggleInclusivo).not.toHaveClass(/bg-emerald-500/);
  }

  async nombres(): Promise<string[]> {
    return (await this.tarjetas.locator('h3').allTextContents()).map((t) => t.trim());
  }

  /**
   * Verifica el conjunto exacto de tarjetas visibles (sin importar el orden). Con una lista vacía
   * exige además el estado «sin resultados», que solo se muestra cuando terminó la carga.
   */
  async expectNombres(esperados: readonly string[]): Promise<void> {
    if (esperados.length === 0) {
      await expect(this.sinResultados).toBeVisible();
      await expect(this.tarjetas).toHaveCount(0);
      return;
    }
    await expect(this.tarjetas).toHaveCount(esperados.length);
    await expect(async () => {
      expect([...(await this.nombres())].sort()).toEqual([...esperados].sort());
    }).toPass();
  }

  tarjeta(nombre: string): Locator {
    return this.tarjetas.filter({ has: this.page.getByRole('heading', { name: nombre, exact: true }) });
  }
}
