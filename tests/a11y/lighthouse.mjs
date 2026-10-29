// Corre Lighthouse (accesibilidad + rendimiento) en escritorio y móvil sobre cada pantalla pública y guarda
// los reportes HTML y JSON en tests/a11y/reports/.
//
// Para medir rendimiento hay que usar el build de producción (el dev server de Vite no es representativo):
//   cd Frontend && npm run build && npm run preview -- --port 4173
// Uso: node tests/a11y/lighthouse.mjs            (LH_BASE_URL por defecto: http://localhost:4173)
//      node tests/a11y/lighthouse.mjs clubes     (solo una pantalla, por nombre o por ruta)
//
// /admin NO está incluida: exige sesión (localStorage.adminToken) y Lighthouse CLI borra/ignora el
// almacenamiento, por lo que termina auditando /login. Medirla a mano con Chrome DevTools → Lighthouse
// después de iniciar sesión (ver docs/informe-accesibilidad.md).
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.LH_BASE_URL ?? 'http://localhost:4173';
const REPORTES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'reports');
const PANTALLAS = { home: '/', clubes: '/clubes', deportistas: '/deportistas', buscar: '/buscar', mapa: '/mapa', solicitud: '/solicitud', login: '/login' };
const FACTORES = ['desktop', 'mobile'];

process.env.CHROME_PATH ??= chromium.executablePath();
mkdirSync(REPORTES, { recursive: true });

const seleccion = process.argv.slice(2);
const pantallas = Object.entries(PANTALLAS).filter(
  ([nombre, ruta]) => seleccion.length === 0 || seleccion.includes(nombre) || seleccion.includes(ruta),
);

for (const [nombre, ruta] of pantallas) {
  for (const factor of FACTORES) {
    const salida = path.join(REPORTES, `lighthouse-${nombre}-${factor}`); // genera .report.html y .report.json
    console.log(`\n== ${nombre} (${factor}) ${BASE}${ruta}`);
    execFileSync(
      'npx',
      [
        'lighthouse', BASE + ruta,
        '--only-categories=accessibility,performance',
        '--output=html', '--output=json',
        `--output-path=${salida}`,
        '--quiet',
        ...(factor === 'desktop' ? ['--preset=desktop'] : ['--form-factor=mobile']),
        '--chrome-flags=--headless=new --no-sandbox',
      ],
      { stdio: 'inherit', shell: process.platform === 'win32' },
    );
  }
}
