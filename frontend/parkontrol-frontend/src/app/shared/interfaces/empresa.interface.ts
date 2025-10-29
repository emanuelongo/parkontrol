import { Usuario } from "./usuario.interface";

export interface Empresa {
  id: number;    
  nit: string;
  nombre: string;
  usuarios?: Usuario[]
}