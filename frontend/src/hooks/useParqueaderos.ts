import { useState, useEffect } from 'react';
import { parqueaderosApi } from '../api/parqueaderos';
import type { Parqueadero } from '../types';

export const useParqueaderos = (idEmpresa: number) => {
  const [parqueaderos, setParqueaderos] = useState<Parqueadero[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchParqueaderos = async () => {
      if (!idEmpresa) return;
      
      setLoading(true);
      try {
        const data = await parqueaderosApi.getByEmpresa(idEmpresa);
        setParqueaderos(data);
      } catch (error) {
        console.error('[HOOK] Error al cargar parqueaderos:', error);
        setParqueaderos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParqueaderos();
  }, [idEmpresa]);

  return { parqueaderos, loading };
};
