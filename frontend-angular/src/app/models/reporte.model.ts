import { Periodo } from './shared.model';

export interface Reporte {
  id: number;
  idParqueadero: number;
  idPeriodo: number;
  urlArchivo?: string;
  fechaGeneracion: string;
  parqueadero?: any;
  periodo?: Periodo;
}

export interface CrearReporteDto {
  idParqueadero: number;
  idPeriodo: number;
  urlArchivo?: string;
}

export interface ActualizarUrlReporteDto {
  urlArchivo: string;
}