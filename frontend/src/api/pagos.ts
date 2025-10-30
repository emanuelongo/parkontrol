import api from './axios';
import type { Pago } from '../types';

export const pagosApi = {
  create: async (data: { idReserva: number; idMetodoPago: number }): Promise<Pago> => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  getByParqueadero: async (idParqueadero: number): Promise<Pago[]> => {
    const { data } = await api.get(`/payments/parqueadero/${idParqueadero}`);
    return data;
  },

  getByReserva: async (idReserva: number): Promise<Pago> => {
    const { data } = await api.get(`/payments/reserva/${idReserva}`);
    return data;
  },

  getById: async (id: number): Promise<Pago> => {
    const { data } = await api.get(`/payments/${id}`);
    return data;
  },
};
