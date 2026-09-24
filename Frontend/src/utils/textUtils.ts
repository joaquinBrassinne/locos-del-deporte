// Utility helpers for string cleaning, normalization, and presentation

export const repairEncoding = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    .replace(/Atl[Ǹ\u01F8]tico/gi, 'Atlético')
    .replace(/R[\uFFFD\u00ED]o/gi, 'Río')
    .replace(/C[\uFFFD\u00F3]rdoba/gi, 'Córdoba')
    .replace(/F[ǧ\u01E7]tbol/gi, 'Fútbol')
    .replace(/B[ǭ\u01ED]squet/gi, 'Básquet')
    .replace(/Nataci[\uFFFD\u00F3]n/gi, 'Natación')
    .replace(/V[\uFFFD\u00F3]ley/gi, 'Vóley')
    .replace(/P[\uFFFD\u00E1]del/gi, 'Pádel')
    .replace(/Ma[\uFFFD\u00F1]ana/gi, 'Mañana')
    .replace(/Instituci[\uFFFD\u00F3]n/gi, 'Institución');
};

export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return '';
  return repairEncoding(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const extractBarrio = (direccion: string | null | undefined): string => {
  if (!direccion) return 'Centro';
  const clean = repairEncoding(direccion);
  const lower = clean.toLowerCase();

  if (lower.includes('centro')) return 'Centro';
  if (lower.includes('norte')) return 'Norte';
  if (lower.includes('sur')) return 'Sur';
  if (lower.includes('este')) return 'Este';
  if (lower.includes('oeste')) return 'Oeste';

  const parts = clean.split(',');
  if (parts.length > 1) {
    const candidate = parts[1].trim();
    if (candidate.length > 2 && candidate.length < 25) {
      return candidate;
    }
  }

  return clean.length > 20 ? 'Río Tercero' : clean;
};

export const extractAnioFundacion = (
  club: { anioFundacion?: number | string; descripcion?: string | null; id: number }
): string | null => {
  if (club.anioFundacion) return String(club.anioFundacion);

  if (club.descripcion) {
    const match =
      club.descripcion.match(/desde\s*(\d{4})/i) ||
      club.descripcion.match(/fundad[oa]\s*(?:en)?\s*(\d{4})/i);
    if (match) return match[1];
  }

  return null;
};
