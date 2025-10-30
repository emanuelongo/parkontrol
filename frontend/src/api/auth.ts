import api from './axios';
import type { Usuario } from '../types';

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  idEmpresa: number;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<Usuario> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};
