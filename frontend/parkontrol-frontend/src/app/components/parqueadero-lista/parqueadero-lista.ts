import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParqueaderoItemComponent } from '../parqueadero-item/parqueadero-item';
import { ParqueaderoConRelacionesDto } from '../../models/parqueaderos/parqueadero-con-relaciones.dto';

@Component({
  selector: 'app-parqueadero-lista',
  imports: [
    ParqueaderoItemComponent,
  ],
  templateUrl: './parqueadero-lista.html',
  styleUrl: './parqueadero-lista.scss',
})
export class ParqueaderoListaComponent {

  @Input() parqueaderos: ParqueaderoConRelacionesDto[]= [];
  @Output() verDetalleParqueadero = new EventEmitter<number>();
  @Output() abrirModalTarifa = new EventEmitter<number>();

  onVerDetalleParqueadero(idParqueadero: number){
    this.verDetalleParqueadero.emit(idParqueadero);
  }

  onAbrirModalTarifa(idParqueadero: number){
    this.abrirModalTarifa.emit(idParqueadero);
  }
}
