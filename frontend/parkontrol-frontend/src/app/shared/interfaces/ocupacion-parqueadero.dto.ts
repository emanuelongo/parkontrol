export interface OcupacionParqueaderoDto {
  idParqueadero: number;
  nombreParqueadero: string;
  idEmpresa?: number;
  nombreEmpresa?: string;
  totalCeldas: number;
  celdasOcupadas: number;
  celdasLibres: number;
}