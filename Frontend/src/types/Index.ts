export type Tipo = 'CLUB' | 'DEPORTISTA';
export type Estado = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Solicitud {
  id: number;
  tipo: Tipo;
  estado: Estado;
  datosAdjuntos: string;
  fechaEnvio?: string;
  fechaRevision?: string;
  motivoRechazo?: string;
  perfilCreadoId?: number;
}

export interface Club {
  id: number;
  nombreInstitucion: string;
  direccion: string;
  disciplinas: string | null;
  telefono: string | null;
  email: string | null;
  sitioWebUrl: string | null;
  descripcion?: string | null;
  horarios?: string | null;
  coordenadas?: string | null;
  deporteAdaptado: boolean;
  fotos: string[];
  cantidadDeportistas: number;
  anioFundacion?: number | string;
  verificado?: boolean;
  instalaciones?: string[];
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
  zona?: string | null;
  subtitulo?: string | null;
  telefono?: string | null;
  email?: string | null;
}

/**
 * Formas de "datosAdjuntos" que espera el backend dentro de SolicitudRequestDTO.
 * Calcadas de ClubRequestDTO.java / DeportistaRequestDTO.java y de la
 * "Guía de Datos para Formulario de Registro (CrazySports)".
 */
export interface ClubFormData {
  nombreInstitucion: string;
  direccion: string;
  disciplinas: string | null; // csv: "Fútbol, Básquet"
  telefono: string | null;
  email: string | null;
  sitioWebUrl: string | null;
  coordenadas: string | null; // "lat,long"
  descripcion: string | null;
  horarios: string | null;
  fotos: string[];
  deporteAdaptado: boolean;
}

export interface DeportistaFormData {
  nombre: string;
  deporte: string;
  edad: number; // @Min(1) en el backend
  historia: string | null;
  logros: string | null;
  sitioWebUrl: string | null;
  telefono: string | null;
  email: string | null;
  fotos: string[];
  deporteAdaptado: boolean;
  clubId: number | null;
}
