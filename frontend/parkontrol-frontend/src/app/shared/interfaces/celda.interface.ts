import { EstadoCelda } from "../../models/enums/estado-celda.enum";
import { Sensor } from "./sensor.interface";
import { TipoCelda } from "./tipo-celda-interface";

export interface Celda {
  id: number;
  idParqueadero: number;
  tipoCelda: TipoCelda;
  sensor: Sensor;
  estado: EstadoCelda;
  ultimoCambioEstado: Date;
}
