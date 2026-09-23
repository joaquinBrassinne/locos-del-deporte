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
