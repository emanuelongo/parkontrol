import { Celda } from "./celda.interface";
import { Tarifa } from "./tarifa.interface";

export interface Parqueadero {
  id: number;
  idEmpresa: number;
  nombre: string;
  capacidadTotal: number;
  ubicacion: string;
  celdas?: Celda[];       
  tarifas?: Tarifa[];    
}
