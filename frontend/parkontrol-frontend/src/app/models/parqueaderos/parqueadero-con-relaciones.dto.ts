import { Celda } from "../../shared/interfaces/celda.interface";
import { Tarifa } from "../../shared/interfaces/tarifa.interface";
import { ParqueaderoResponseDto } from "./parqueadero-response.dto";

export interface ParqueaderoConRelacionesDto extends ParqueaderoResponseDto {
  celdas: Celda[];
  tarifas: Tarifa[];
}