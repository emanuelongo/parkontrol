export interface JwtPayload {
  id: number;
  correo: string;
  nombreRol: string;  //'ADMIN' o 'OPERADOR'
  idEmpresa: number | null;    // Solo admin
  idParqueadero: number | null; // Solo operador
}