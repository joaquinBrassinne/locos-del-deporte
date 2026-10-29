import { expect, test as base, type APIRequestContext } from '@playwright/test';
import type { ClubDatos, DeportistaDatos } from './datos';

const API_URL = process.env.API_URL ?? 'http://localhost:8080';
const ADMIN_USER = process.env.ADMIN_USER ?? 'AdminRoot';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'locos1234';

interface Perfil {
  id: number;
}

/**
 * Cliente de la API del backend para preparar datos y limpiar. Todo lo que crea queda registrado y
 * `limpiar()` lo elimina al terminar el test (haya pasado o fallado).
 *
 * Limitación de la API: no existe DELETE de solicitudes. Las solicitudes pendientes que quedan se
 * cierran como RECHAZADO; las aprobadas quedan en solicitudes_registro (ver tests/e2e/README.md).
 */
export class ApiClient {
  private readonly clubes: number[] = [];
  private readonly deportistas: number[] = [];
  private readonly solicitudes: number[] = [];

  constructor(private readonly ctx: APIRequestContext) {}

  /** POST /api/solicitudes (público). Devuelve el id de la solicitud PENDIENTE. */
  async crearSolicitud(tipo: 'CLUB' | 'DEPORTISTA', datos: ClubDatos | DeportistaDatos): Promise<number> {
    const res = await this.ctx.post('/api/solicitudes', {
      data: { tipo, datosAdjuntos: JSON.stringify(datos) },
    });
    expect(res.status(), `POST /api/solicitudes ${await res.text()}`).toBe(201);
    const { id } = (await res.json()) as Perfil;
    this.solicitudes.push(id);
    return id;
  }

  /** POST /api/admin/club/{id}: aprueba la solicitud y crea el club. */
  async aprobarClub(idSolicitud: number, datos: ClubDatos): Promise<number> {
    const res = await this.ctx.post(`/api/admin/club/${idSolicitud}`, { data: datos });
    expect(res.status(), `POST /api/admin/club/${idSolicitud} ${await res.text()}`).toBe(201);
    const { id } = (await res.json()) as Perfil;
    this.clubes.push(id);
    return id;
  }

  /** POST /api/admin/deportista/{id}: aprueba la solicitud y crea el deportista. */
  async aprobarDeportista(idSolicitud: number, datos: DeportistaDatos): Promise<number> {
    const res = await this.ctx.post(`/api/admin/deportista/${idSolicitud}`, { data: datos });
    expect(res.status(), `POST /api/admin/deportista/${idSolicitud} ${await res.text()}`).toBe(201);
    const { id } = (await res.json()) as Perfil;
    this.deportistas.push(id);
    return id;
  }

  /**
   * PATCH /api/solicitudes/{id}/aprobar: la ruta que usa el panel /admin del frontend. Crea el
   * perfil a partir de datosAdjuntos. Para poder limpiar sin depender de `perfilCreadoId`,
   * el perfil se busca por nombre en el listado público y se registra para eliminarlo.
   */
  async aprobarPorPatch(idSolicitud: number, tipo: 'CLUB' | 'DEPORTISTA', nombre: string): Promise<void> {
    const res = await this.ctx.patch(`/api/solicitudes/${idSolicitud}/aprobar`);
    expect(res.status(), `PATCH aprobar ${await res.text()}`).toBe(200);
    const listado = await this.ctx.get(tipo === 'CLUB' ? '/api/clubes' : '/api/deportistas');
    const perfiles = (await listado.json()) as Array<Perfil & { nombreInstitucion?: string; nombre?: string }>;
    const creado = perfiles.find((p) => (tipo === 'CLUB' ? p.nombreInstitucion : p.nombre) === nombre);
    if (creado) (tipo === 'CLUB' ? this.clubes : this.deportistas).push(creado.id);
  }

  /** PUT /api/admin/rechazar/{id}/{motivo} */
  async rechazar(idSolicitud: number, motivo: string): Promise<void> {
    const res = await this.ctx.put(`/api/admin/rechazar/${idSolicitud}/${encodeURIComponent(motivo)}`);
    expect(res.status(), `PUT rechazar ${await res.text()}`).toBe(200);
  }

  /** Crea un club ya aprobado (solicitud + aprobación). */
  async crearClubAprobado(datos: ClubDatos): Promise<number> {
    const idSolicitud = await this.crearSolicitud('CLUB', datos);
    return this.aprobarClub(idSolicitud, datos);
  }

  /** Crea un deportista ya aprobado (solicitud + aprobación). */
  async crearDeportistaAprobado(datos: DeportistaDatos): Promise<number> {
    const idSolicitud = await this.crearSolicitud('DEPORTISTA', datos);
    return this.aprobarDeportista(idSolicitud, datos);
  }

  /** Elimina los perfiles creados y cierra las solicitudes que sigan PENDIENTES. */
  async limpiar(): Promise<void> {
    for (const id of this.clubes) await this.ctx.delete(`/api/clubes/${id}`);
    for (const id of this.deportistas) await this.ctx.delete(`/api/deportistas/${id}`);
    for (const id of this.solicitudes) {
      // 200 si estaba PENDIENTE; 400 si ya estaba aprobada/rechazada (nada que cerrar).
      await this.ctx.put(`/api/admin/rechazar/${id}/limpieza-e2e`);
    }
    this.clubes.length = this.deportistas.length = this.solicitudes.length = 0;
  }
}

export const test = base.extend<{ api: ApiClient }>({
  api: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL: API_URL,
      extraHTTPHeaders: {
        Authorization: 'Basic ' + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString('base64'),
      },
    });
    const api = new ApiClient(ctx);
    try {
      await use(api);
    } finally {
      await api.limpiar();
      await ctx.dispose();
    }
  },
});

export { expect };
