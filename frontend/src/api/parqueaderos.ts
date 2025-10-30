import api from './axios';
import type { Parqueadero } from '../types';

export const parqueaderosApi = {
  create: async (data: Omit<Parqueadero, 'id'>): Promise<Parqueadero> => {
    const response = await api.post('/parking-lots', data);
    return response.data;
  },

  getByEmpresa: async (idEmpresa: number): Promise<Parqueadero[]> => {
    const { data } = await api.get(`/parking-lots/empresa/${idEmpresa}`);
    return data;
  },

  getById: async (id: number): Promise<Parqueadero> => {
    const { data } = await api.get(`/parking-lots/${id}`);
    return data;
  },
};
