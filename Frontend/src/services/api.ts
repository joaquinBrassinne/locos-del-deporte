import type { Club, Deportista, ClubFormData, DeportistaFormData, Solicitud, Tipo } from '../types/Index';

const API_BASE_URL = 'http://localhost:8080/api';

export const getClubes = async (): Promise<Club[]> => {
  const res = await fetch(`${API_BASE_URL}/clubes`);
  if (!res.ok) {
    throw new Error(`Error al obtener clubes: ${res.statusText || res.status}`);
  }
  return res.json();
};

export const getClubesAdaptados = async (): Promise<Club[]> => {
  const res = await fetch(`${API_BASE_URL}/clubes/adaptado`);
  if (!res.ok) {
    throw new Error(`Error al obtener clubes adaptados: ${res.statusText || res.status}`);
  }
  return res.json();
};

export const buscarClubes = async (params: { nombre?: string; disciplina?: string }): Promise<Club[]> => {
  const query = new URLSearchParams();
  if (params.nombre && params.nombre.trim() !== '') {
    query.append('nombre', params.nombre.trim());
  }
  if (params.disciplina && params.disciplina.trim() !== '') {
    query.append('disciplina', params.disciplina.trim());
  }
  const queryString = query.toString();
  const url = `${API_BASE_URL}/clubes/buscar${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al buscar clubes: ${res.statusText || res.status}`);
  }
  return res.json();
};

export const getDeportistas = async (): Promise<Deportista[]> => {
  const res = await fetch(`${API_BASE_URL}/deportistas`);
  if (!res.ok) {
    throw new Error(`Error al obtener deportistas: ${res.statusText || res.status}`);
  }
  return res.json();
};

export const getDeportistasAdaptados = async (): Promise<Deportista[]> => {
  const res = await fetch(`${API_BASE_URL}/deportistas/adaptado`);
  if (!res.ok) {
    throw new Error(`Error al obtener deportistas adaptados: ${res.statusText || res.status}`);
  }
  return res.json();
};

export const buscarDeportistas = async (deporte: string): Promise<Deportista[]> => {
  const res = await fetch(`${API_BASE_URL}/deportistas/buscar?deporte=${encodeURIComponent(deporte)}`);
  if (!res.ok) {
    throw new Error(`Error al buscar deportistas: ${res.statusText || res.status}`);
  }
  return res.json();
};

/**
 * POST /api/solicitudes es público (SecurityConfig: permitAll para este método+ruta).
 * `datosAdjuntos` viaja como JSON *serializado a string* porque el backend hace
 * objectMapper.readValue(datosAdjuntos, ClubRequestDTO.class | DeportistaRequestDTO.class).
 * Si el backend rechaza por "nombreInstitucion duplicado" u otra validación de negocio,
 * la respuesta no-ok cae en el catch del hook y se muestra como error de servidor.
 */
export const enviarSolicitud = async (
  tipo: Tipo,
  datos: ClubFormData | DeportistaFormData
): Promise<Solicitud> => {
  const res = await fetch(`${API_BASE_URL}/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tipo,
      datosAdjuntos: JSON.stringify(datos),
    }),
  });

  if (!res.ok) {
    let mensaje = `Error al enviar la solicitud: ${res.statusText || res.status}`;
    try {
      // GlobalExceptionHandler devuelve { error, mensaje }; otros 4xx de Spring
      // (ej. @Valid de SolicitudRequestDTO) pueden venir con otro shape, por eso
      // se intentan varias claves antes de caer en el mensaje genérico.
      const cuerpo = await res.json();
      mensaje = cuerpo?.mensaje || cuerpo?.message || cuerpo?.detail || mensaje;
    } catch {
      // el backend no siempre devuelve JSON en errores (ej. 403 de Spring Security)
    }
    throw new Error(mensaje);
  }

  return res.json();
};
//FUNCIONES PARA ELIMINAR CLUBES Y DEPORTISTAS
export const eliminarClub = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/clubes/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Basic ${token}` }
  });
  if (!res.ok) throw new Error('Error al eliminar el club');
};

export const eliminarDeportista = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/deportistas/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Basic ${token}` }
  });
  if (!res.ok) throw new Error('Error al eliminar el deportista');
};


//FUNCIONES PARA MODIFICAR UN CLUB O DEPORTISTA
export const modificarClub = async (id: number, datos: ClubFormData, token: string): Promise<Club> => {
  const res = await fetch(`${API_BASE_URL}/clubes/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}` 
    },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al modificar el club');
  return res.json();
};

export const modificarDeportista = async (id: number, datos: DeportistaFormData, token: string): Promise<Deportista> => {
  const res = await fetch(`${API_BASE_URL}/deportistas/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}` 
    },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error('Error al modificar el deportista');
  return res.json();
};