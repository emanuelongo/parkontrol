import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParqueaderoConRelacionesDto } from '../../models/parqueaderos/parqueadero-con-relaciones.dto';

@Component({
  selector: 'app-parqueadero-item',
  imports: [],
  templateUrl: './parqueadero-item.html',
  styleUrl: './parqueadero-item.scss',
})
export class ParqueaderoItemComponent {

  @Input() parqueadero!: ParqueaderoConRelacionesDto;
  @Output() verDetalleParqueadero= new EventEmitter<number>();
  @Output() abrirModalTarifa = new EventEmitter<number>();

  verDetalle(){
    this.verDetalleParqueadero.emit(this.parqueadero.id);
  }

  modificarTarifa(){
    this.abrirModalTarifa.emit(this.parqueadero.id);
  }


}
