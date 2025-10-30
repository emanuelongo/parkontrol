import { useState, useEffect } from 'react';
import { empresasApi } from '../api/empresas';
import type { Empresa } from '../types';

export const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      setLoading(true);
      try {
        const data = await empresasApi.getAll();
        setEmpresas(data);
      } catch (error) {
        console.error('[useEmpresas] Error al cargar empresas:', error);
        setEmpresas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  return { empresas, loading };
};
