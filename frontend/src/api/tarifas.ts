import api from './axios';
import type { Tarifa } from '../types';

export const tarifasApi = {
  create: async (data: Omit<Tarifa, 'idTarifa'>): Promise<Tarifa> => {
    const response = await api.post('/rates', data);
    return response.data;
  },

  getByParqueadero: async (idParqueadero: number): Promise<Tarifa[]> => {
    const { data } = await api.get(`/rates/parqueadero/${idParqueadero}`);
    return data;
  },

  getById: async (id: number): Promise<Tarifa> => {
    const { data } = await api.get(`/rates/${id}`);
    return data;
  },

  update: async (id: number, data: Partial<Omit<Tarifa, 'idTarifa'>>): Promise<Tarifa> => {
    const response = await api.patch(`/rates/${id}`, data);
    return response.data;
  },
};
