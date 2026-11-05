import { useState, useEffect, useCallback } from 'react';
import type { Deportista } from '../types/Index';
import { getDeportistas, buscarDeportistas, getDeportistasAdaptados } from '../services/api';

export const useDeportistas = () => {
  const [deportistas, setDeportistas] = useState<Deportista[]>([]);
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
      const data = await getDeportistas();
      setDeportistas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar deportistas');
    } finally {
      setLoading(false);
    }
  }, []);

  const buscar = useCallback(async (deporte: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await buscarDeportistas(deporte);
      setDeportistas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar deportistas');
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarAdaptado = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDeportistasAdaptados();
      setDeportistas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar deportistas adaptados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarTodos();
  }, [trigger]);

  return {
    deportistas,
    loading,
    error,
    buscar,
    filtrarAdaptado,
    cargarTodos,
    refetch
  };
};
