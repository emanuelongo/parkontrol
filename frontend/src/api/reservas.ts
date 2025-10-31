import api from './axios';
import type { Reserva } from '../types';

export const reservasApi = {
  create: async (data: {
    idCelda: number;
    idVehiculo: number;
    estado: string;
  }): Promise<Reserva> => {
    const response = await api.post('/reservations', data);
    return response.data;
  },

  getActivas: async (): Promise<Reserva[]> => {
    const { data } = await api.get('/reservations/activas');
    return data;
  },

  getByParqueadero: async (idParqueadero: number): Promise<Reserva[]> => {
    const { data } = await api.get(`/reservations/parqueadero/${idParqueadero}`);
    return data;
  },

  getById: async (id: number): Promise<Reserva> => {
    const { data } = await api.get(`/reservations/${id}`);
    return data;
  },

  finalizar: async (id: number): Promise<Reserva> => {
    const { data } = await api.patch(`/reservations/${id}/finalizar`);
    return data;
  },
};
