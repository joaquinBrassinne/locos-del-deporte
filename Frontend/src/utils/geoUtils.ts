import type { Club } from '../types/Index';

export type LatLngTuple = [number, number];

export interface ClubWithCoords extends Club {
  parsedCoords: LatLngTuple;
}

/**
 * Coordenadas de referencia para Río Tercero, Córdoba (fallback cuando no hay clubes o para vista inicial).
 */
export const DEFAULT_CENTER: LatLngTuple = [-32.1738, -64.1141];
export const DEFAULT_ZOOM = 13;

/**
 * Parsea y valida de manera segura una cadena de coordenadas en formato "latitud,longitud".
 * 
 * Reglas de validación:
 * 1. Verifica que coordenadas exista y sea un string no vacío.
 * 2. Separa por coma exactamente en 2 partes.
 * 3. Convierte ambas a number.
 * 4. Valida que sean números finitos válidos (!isNaN y isFinite).
 * 5. Valida rangos geográficos:
 *    - Latitud: entre -90 y 90
 *    - Longitud: entre -180 y 180
 * 
 * Si cualquier verificación falla, retorna null sin lanzar errores ni romper la aplicación.
 */
export function parseCoordinates(coordStr?: string | null): LatLngTuple | null {
  if (!coordStr || typeof coordStr !== 'string') {
    return null;
  }

  const trimmed = coordStr.trim();
  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(',');
  if (parts.length !== 2) {
    return null;
  }

  const latStr = parts[0].trim();
  const lngStr = parts[1].trim();

  if (!latStr || !lngStr) {
    return null;
  }

  const lat = Number(latStr);
  const lng = Number(lngStr);

  if (Number.isNaN(lat) || Number.isNaN(lng) || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return [lat, lng];
}

/**
 * Filtra los clubes que tienen coordenadas geográficas válidas y
 * les añade la propiedad tipada `parsedCoords: [number, number]`.
 */
export function filterClubsWithValidCoordinates(clubs: Club[]): ClubWithCoords[] {
  if (!Array.isArray(clubs)) {
    return [];
  }

  const result: ClubWithCoords[] = [];

  for (const club of clubs) {
    const coords = parseCoordinates(club.coordenadas);
    if (coords) {
      result.push({
        ...club,
        parsedCoords: coords,
      });
    }
  }

  return result;
}
