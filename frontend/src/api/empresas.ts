import api from './axios';
import type { Empresa } from '../types';

export const empresasApi = {
  getAll: async (): Promise<Empresa[]> => {
    const { data } = await api.get('/companies');
    return data;
  },
  
  getById: async (id: number): Promise<Empresa> => {
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },
};
