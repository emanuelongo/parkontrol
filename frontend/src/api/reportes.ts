import api from './axios';
import type { Reporte } from '../types';

export const reportesApi = {
  create: async (data: {
    idParqueadero: number;
    idPeriodo: number;
    urlArchivo?: string;
  }): Promise<Reporte> => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  getByParqueadero: async (idParqueadero: number): Promise<Reporte[]> => {
    const { data } = await api.get(`/reports/parqueadero/${idParqueadero}`);
    return data;
  },

  getById: async (id: number): Promise<Reporte> => {
    const { data } = await api.get(`/reports/${id}`);
    return data;
  },

  updateUrl: async (id: number, urlArchivo: string): Promise<Reporte> => {
    const response = await api.patch(`/reports/${id}/url`, { urlArchivo });
    return response.data;
  },
};
