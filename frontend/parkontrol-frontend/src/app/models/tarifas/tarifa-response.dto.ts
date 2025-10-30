export interface TarifaResponseDto {
  id: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number | null;
  tipoVehiculo: {
    id: number;
    nombre?: string;
  };
  parqueadero: {
    id: number;
    nombre?: string;
    idEmpresa?: number;
  };
}