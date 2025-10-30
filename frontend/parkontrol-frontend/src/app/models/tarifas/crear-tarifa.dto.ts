export interface CrearTarifaDto {
  idParqueadero: number;
  idTipoVehiculo: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number;
}