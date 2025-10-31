import api from './axios';
import type { Celda } from '../types';

export const celdasApi = {
  create: async (data: Omit<Celda, 'id'>): Promise<Celda> => {
    const response = await api.post('/cells', data);
    return response.data;
  },

  getByParqueadero: async (idParqueadero: number): Promise<Celda[]> => {
    const { data } = await api.get(`/cells/parqueadero/${idParqueadero}`);
    return data;
  },

  getById: async (id: number): Promise<Celda> => {
    const { data } = await api.get(`/cells/${id}`);
    return data;
  },

  updateEstado: async (id: number, estado: string): Promise<Celda> => {
    const { data } = await api.patch(`/cells/${id}/estado`, { estado });
    return data;
  },
};
