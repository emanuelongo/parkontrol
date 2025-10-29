import { TipoVehiculo } from "../../shared/interfaces/tipo-vehiculo.interface";

export interface CrearTarifaDto {
  idParqueadero: number;
  tipoVehiculoId?: number;
  precioFraccionHora: number;
  precioHoraAdicional: number;
}