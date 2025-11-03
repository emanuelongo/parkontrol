import { TipoVehiculo } from './shared.model';

export interface Tarifa {
  id: number;
  idParqueadero: number;
  idTipoVehiculo: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number;
  parqueadero?: any;
  tipoVehiculo?: TipoVehiculo;
}

export interface CrearTarifaDto {
  idParqueadero: number;
  idTipoVehiculo: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number;
}

export interface ActualizarTarifaDto {
  precioFraccionHora?: number;
  precioHoraAdicional?: number;
}