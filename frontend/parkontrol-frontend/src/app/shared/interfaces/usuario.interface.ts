import { Empresa } from "./empresa.interface";
import { Parqueadero } from "./parqueadero.interface";

export enum Rol{
    ADMIN = 'ADMIN',
    OPERADOR = 'OPERADOR',
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: Rol;
  empresa: Empresa;
  parqueadero?: Parqueadero;
}
