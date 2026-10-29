// Datos de prueba base DS-01 (Plan de Pruebas v1.1) y generadores de datos E2E.

export const CLUBES_DS01 = {
  atleticoRioTercero: 'Club Atlético Río Tercero',
  nauticoRioTercero: 'Club Náutico Río Tercero',
  atleticoSur: 'Club Atlético Sur',
} as const;

export const TODOS_LOS_CLUBES = Object.values(CLUBES_DS01);

export const DEPORTISTAS_DS01 = {
  lucia: 'Lucía Pérez',
  mateo: 'Mateo Gómez',
  sofia: 'Sofía Díaz',
  tomas: 'Tomás Ruiz',
} as const;

export const TODOS_LOS_DEPORTISTAS = Object.values(DEPORTISTAS_DS01);

/** Etiqueta única por ejecución: evita choques con DS-01 y con corridas anteriores. */
export const unico = (prefijo: string): string =>
  `${prefijo} ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export interface ClubDatos {
  nombreInstitucion: string;
  direccion: string;
  telefono: string;
  email: string;
  disciplinas: string;
  deporteAdaptado: boolean;
  fotos: string[];
}

export interface DeportistaDatos {
  nombre: string;
  deporte: string;
  edad: number;
  historia: string;
  logros: string;
  deporteAdaptado: boolean;
  fotos: string[];
  clubId: number | null;
}

export const clubDatos = (nombreInstitucion: string, extra: Partial<ClubDatos> = {}): ClubDatos => ({
  nombreInstitucion,
  direccion: 'Av. Test 123',
  telefono: '3571000000',
  email: 'e2e@test.com',
  disciplinas: 'Fútbol',
  deporteAdaptado: false,
  fotos: [],
  ...extra,
});

export const deportistaDatos = (nombre: string, extra: Partial<DeportistaDatos> = {}): DeportistaDatos => ({
  nombre,
  deporte: 'Fútbol',
  edad: 25,
  historia: 'Historia de prueba',
  logros: 'Campeón local 2024',
  deporteAdaptado: false,
  fotos: [],
  clubId: null,
  ...extra,
});
