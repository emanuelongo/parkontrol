import { EstadoCelda } from "../../models/enums/estado-celda.enum";
import { Sensor } from "./sensor.interface";
import { TipoCelda } from "./tipo-celda-interface";
export interface TipoCeldaSimple {
  id: number;
  nombre?: string;
}

export interface SensorSimple {
  id: number;
  nombre?: string;
}

export interface ParqueaderoSimple {
  id: number;
  nombre?: string;
}

export interface Celda {
  id: number;
  estado: string;
  ultimoCambioEstado?: string; 
  parqueadero: ParqueaderoSimple;
  tipoCelda: TipoCeldaSimple;
  sensor: SensorSimple;
}