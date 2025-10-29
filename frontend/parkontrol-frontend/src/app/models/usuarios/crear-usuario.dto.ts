//Para admin crear operadores, admin registrarse
export interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  contrasena: string;
  idParqueadero?: number;
}