export interface Club {
  id: number;
  nombreInstitucion: string;
  direccion: string;
  disciplinas: string | null;
  telefono: string | null;
  email: string | null;
  sitioWebUrl: string | null;
  deporteAdaptado: boolean;
  fotos: string[];
  cantidadDeportistas: number;
}

export interface Deportista {
  id: number;
  nombre: string;
  deporte: string;
  edad: number;
  historia: string | null;
  logros: string | null;
  sitioWebUrl: string | null;
  deporteAdaptado: boolean;
  fotos: string[];
  clubNombre: string | null;
}
