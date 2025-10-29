import { Injectable } from '@angular/core';
import { ParqueaderoConRelacionesDto } from '../models/parqueaderos/parqueadero-con-relaciones.dto';

@Injectable({
  providedIn: 'root'
})
export class DetalleParqueaderoService {
  private parqueadero?: ParqueaderoConRelacionesDto;

  setParqueadero(parqueadero: ParqueaderoConRelacionesDto) {
    this.parqueadero = parqueadero;
  }

  getParqueadero(): ParqueaderoConRelacionesDto | undefined {
    return this.parqueadero;
  }

  limpiar() {
    this.parqueadero = undefined;
  }

}
