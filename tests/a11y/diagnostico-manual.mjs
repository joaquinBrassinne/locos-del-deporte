// Mediciones automáticas de apoyo al checklist manual WCAG 2.2 AA (docs/informe-accesibilidad.md).
// No reemplazan la revisión humana: solo registran evidencia objetiva sobre puntos que axe no cubre.
// Uso: node tests/a11y/diagnostico-manual.mjs   (frontend en :5173 y backend en :8080 con DS-01)
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.BASE_URL ?? 'http://localhost:5173';
const ADMIN = `${process.env.ADMIN_USER ?? 'AdminRoot'}:${process.env.ADMIN_PASSWORD ?? 'locos1234'}`;
const REPORTES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'reports');
const PANTALLAS = ['/', '/clubes', '/deportistas', '/buscar', '/mapa', '/solicitud', '/login', '/admin'];

const browser = await chromium.launch();
const resultado = { fecha: new Date().toISOString(), base: BASE };

async function nuevaPagina(viewport = { width: 1280, height: 720 }) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript((t) => localStorage.setItem('adminToken', t), Buffer.from(ADMIN).toString('base64'));
  return ctx.newPage();
}

// 1. Idioma de la página, título y encabezados por pantalla
resultado.paginas = {};
for (const ruta of PANTALLAS) {
  const page = await nuevaPagina();
  await page.goto(BASE + ruta);
  await page.waitForLoadState('networkidle');
  resultado.paginas[ruta] = await page.evaluate(() => ({
    htmlLang: document.documentElement.lang,
    titulo: document.title,
    h1: document.querySelectorAll('h1').length,
    encabezados: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => `${h.tagName}:${h.textContent.trim().slice(0, 40)}`),
    enlaceSaltarContenido: !!document.querySelector('a[href^="#"]:not([href="#"])'),
    landmarks: ['header', 'nav', 'main', 'footer'].map((t) => `${t}=${document.querySelectorAll(t).length}`),
    imgsSinAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length,
    imgsTotal: document.querySelectorAll('img').length,
  }));
  await page.context().close();
}

// 2. Reflow / zoom 200 % (1280x720 a 200 % equivale a 640x360 CSS px): desplazamiento horizontal
resultado.reflow200 = {};
for (const ruta of PANTALLAS) {
  const page = await nuevaPagina({ width: 640, height: 360 });
  await page.goto(BASE + ruta);
  await page.waitForLoadState('networkidle');
  resultado.reflow200[ruta] = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    desbordaHorizontal: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  await page.context().close();
}

// 3. /login: nombre accesible de los campos y foco visible
{
  const page = await nuevaPagina();
  await page.goto(BASE + '/login');
  resultado.login = await page.evaluate(() =>
    [...document.querySelectorAll('input')].map((i) => ({
      placeholder: i.placeholder,
      label: !!(i.labels && i.labels.length),
      ariaLabel: i.getAttribute('aria-label'),
      ariaLabelledby: i.getAttribute('aria-labelledby'),
      title: i.getAttribute('title'),
    })),
  );
  const usuario = page.getByPlaceholder('Usuario');
  await usuario.focus();
  resultado.loginFoco = await usuario.evaluate((el) => {
    const contenedor = el.parentElement;
    const e = getComputedStyle(el);
    const c = getComputedStyle(contenedor);
    return {
      inputOutlineStyle: e.outlineStyle,
      inputBoxShadow: e.boxShadow,
      contenedorBorde: c.border,
      contenedorOutline: c.outlineStyle,
      contenedorBoxShadow: c.boxShadow,
    };
  });
  await usuario.fill('x');
  await page.getByPlaceholder('Contraseña').fill('y');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.waitForTimeout(1200);
  resultado.loginError = await page.evaluate(() => {
    const p = document.querySelector('form p');
    return p ? { texto: p.textContent, role: p.getAttribute('role'), ariaLive: p.getAttribute('aria-live') } : null;
  });
  await page.context().close();
}

// 4. /clubes: modal (rol, nombre, foco, Escape) y toggle «Deporte Inclusivo» (rol, teclado)
{
  const page = await nuevaPagina();
  await page.goto(BASE + '/clubes');
  await page.locator('article').first().waitFor();
  const boton = page.locator('article').first().getByRole('button', { name: /Ver más/ });
  await boton.focus();
  await boton.click();
  await page.waitForTimeout(400);
  resultado.modalClub = await page.evaluate(() => {
    const overlay = document.querySelector('.fixed.inset-0.z-50');
    const cerrar = overlay?.querySelector('button');
    return {
      abierto: !!overlay,
      role: overlay?.getAttribute('role') ?? overlay?.firstElementChild?.getAttribute('role') ?? null,
      ariaModal: overlay?.querySelector('[aria-modal]') ? true : false,
      ariaLabelledby: overlay?.querySelector('[aria-labelledby]') ? true : false,
      botonCerrarNombreAccesible: cerrar ? (cerrar.getAttribute('aria-label') || cerrar.textContent.trim() || null) : undefined,
      focoDentroDelModal: overlay ? overlay.contains(document.activeElement) : false,
      elementoConFoco: document.activeElement?.tagName + ' ' + (document.activeElement?.textContent || '').trim().slice(0, 30),
    };
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  resultado.modalClub.cierraConEscape = (await page.locator('.fixed.inset-0.z-50').count()) === 0;
  resultado.modalClub.focoVuelveAlBoton = await boton.evaluate((el) => el === document.activeElement);

  const toggle = page.locator('label[for="toggle-adaptado"] > div');
  resultado.toggle = await toggle.evaluate((el) => ({
    role: el.getAttribute('role'),
    tabindex: el.getAttribute('tabindex'),
    ariaChecked: el.getAttribute('aria-checked'),
    esElementoNativo: ['INPUT', 'BUTTON'].includes(el.tagName),
  }));
  // Recorrer con Tab hasta 40 veces buscando si el toggle recibe foco
  await page.goto(BASE + '/clubes');
  await page.locator('article').first().waitFor();
  let recibioFoco = false;
  for (let i = 0; i < 40 && !recibioFoco; i++) {
    await page.keyboard.press('Tab');
    recibioFoco = await toggle.evaluate((el) => el === document.activeElement || el.contains(document.activeElement));
  }
  resultado.toggle.recibeFocoConTab = recibioFoco;
  await page.context().close();
}

// 5. /solicitud: errores de validación (asociación con el campo, aria-invalid, anuncio)
{
  const page = await nuevaPagina();
  await page.goto(BASE + '/solicitud');
  await page.getByRole('button', { name: /ENVIAR SOLICITUD/ }).click();
  await page.waitForTimeout(500);
  resultado.solicitudErrores = await page.evaluate(() => {
    const invalidos = [...document.querySelectorAll('[aria-invalid="true"]')];
    return {
      camposAriaInvalid: invalidos.length,
      conAriaDescribedby: invalidos.filter((i) => i.getAttribute('aria-describedby')).length,
      mensajesConRolAlert: document.querySelectorAll('[role="alert"]').length,
      regionesAriaLive: document.querySelectorAll('[aria-live]').length,
      camposTotales: document.querySelectorAll('input,select,textarea').length,
      camposSinLabelNiAria: [...document.querySelectorAll('input,select,textarea')].filter(
        (i) => !(i.labels && i.labels.length) && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'),
      ).length,
      focoTrasEnviar: document.activeElement?.tagName,
    };
  });
  await page.context().close();
}

mkdirSync(REPORTES, { recursive: true });
writeFileSync(path.join(REPORTES, 'diagnostico-manual.json'), JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));
await browser.close();
