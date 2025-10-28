export interface JwtUsuario {
  id: number;
  correo: string;
  nombreRol: string;
  idEmpresa: number | null;
  idParqueadero: number | null;
}
