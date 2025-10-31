import api from './axios';
import type { Usuario } from '../types';

export const usuariosApi = {
  create: async (data: {
    nombre: string;
    correo: string;
    contrasena: string;
    idEmpresa: number;
  }): Promise<Usuario> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  getByEmpresa: async (idEmpresa: number): Promise<Usuario[]> => {
    const { data } = await api.get(`/users/empresa/${idEmpresa}`);
    return data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  delete: async (id: number): Promise<{ mensaje: string }> => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
