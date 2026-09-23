import type { Club, Deportista } from '../types/Index';

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
