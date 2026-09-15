import { useState, useEffect, useCallback } from 'react';
import type { Club } from '../types';
import { getClubes, buscarClubes, getClubesAdaptados } from '../services/api';

export const useClubes = () => {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  const cargarTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClubes();
      setClubes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clubes');
    } finally {
      setLoading(false);
    }
  }, []);

  const buscar = useCallback(async (params: { nombre?: string; disciplina?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await buscarClubes(params);
      setClubes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar clubes');
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarAdaptado = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClubesAdaptados();
      setClubes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clubes adaptados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTodos();
  }, [trigger]);

  return {
    clubes,
    loading,
    error,
    buscar,
    filtrarAdaptado,
    cargarTodos,
    refetch,
  };
};
