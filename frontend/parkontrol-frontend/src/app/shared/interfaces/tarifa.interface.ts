import { TipoVehiculo } from "./tipo-vehiculo.interface";

export interface Tarifa {
  id: number;
  idParqueadero: number;
  tipoVehiculo: TipoVehiculo;
  precioFraccionHora: number;
  precioHoraAdicional: number; 
}
