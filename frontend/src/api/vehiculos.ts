import api from './axios';
import type { Vehiculo } from '../types';

export const vehiculosApi = {
  create: async (data: Omit<Vehiculo, 'id'>): Promise<Vehiculo> => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },

  getByPlaca: async (placa: string): Promise<Vehiculo> => {
    const { data } = await api.get(`/vehicles/placa/${placa}`);
    return data;
  },

  getById: async (id: number): Promise<Vehiculo> => {
    const { data } = await api.get(`/vehicles/${id}`);
    return data;
  },
};
