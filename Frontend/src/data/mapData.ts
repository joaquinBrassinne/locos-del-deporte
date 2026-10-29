import type { Club, Deportista } from '../types/Index';
import { parseCoordinates } from '../utils/geoUtils';
import { repairEncoding } from '../utils/textUtils';

export interface MapItem {
  id: string | number;
  type: 'CANCHA' | 'CLUB' | 'DEPORTISTA';
  nombre: string;
  direccion: string;
  coordenadas: [number, number]; // [latitud, longitud]
  disciplinas: string[];
  deporteAdaptado: boolean;
  distancia?: string;
  tipoDetalle?: string; // Ej: "Sede Central y Estadio", "Predio Deportivo", "Público / Municipal"
  fotoUrl?: string;
  siglas?: string; // Ej: "CS9J", "CART", "PM"
  descripcion?: string;
  rawClub?: Club;
  rawDeportista?: Deportista;
}

export function buildMapItems(dbClubs: Club[] = []): MapItem[] {
  const result: MapItem[] = [];

  dbClubs.forEach((club) => {
    const coords = parseCoordinates(club.coordenadas);
    if (!coords) return;

    const cleanNombre = repairEncoding(club.nombreInstitucion);

    const disciplinasList = club.disciplinas
      ? repairEncoding(club.disciplinas)
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean)
      : [];

    const isCancha =
      cleanNombre.toLowerCase().includes('polideportivo') ||
      cleanNombre.toLowerCase().includes('complejo') ||
      cleanNombre.toLowerCase().includes('cancha');

    const item: MapItem = {
      id: `db-club-${club.id}`,
      type: isCancha ? 'CANCHA' : 'CLUB',
      nombre: cleanNombre,
      direccion: repairEncoding(club.direccion) || 'Río Tercero, Córdoba',
      coordenadas: coords,
      disciplinas: disciplinasList,
      deporteAdaptado: Boolean(club.deporteAdaptado),
      distancia: 'Río Tercero',
      tipoDetalle: isCancha ? 'Canchas / Complejo' : 'Club Deportivo',
      siglas: cleanNombre
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 4)
        .toUpperCase(),
      fotoUrl: (club.fotos || []).find((f) => f && !f.includes('string')),
      descripcion: repairEncoding(club.descripcion || ''),
      rawClub: club,
    };

    result.push(item);
  });

  return result;
}
