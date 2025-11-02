export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  idEmpresa: number;
}

export interface LoginUsuarioDto {
  correo: string;
  contrasena: string;
}

export interface LoginResponseDto {
  access_token: string;
}

export interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: string;
  idEmpresa: number;
}

export interface RegistrarUsuarioDto extends CreateUsuarioDto {}