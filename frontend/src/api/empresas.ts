import api from './axios';
import type { Empresa } from '../types';

export const empresasApi = {
  getById: async (id: number): Promise<Empresa> => {
    const { data } = await api.get(`/companies/${id}`);
    return data;
  },
};
