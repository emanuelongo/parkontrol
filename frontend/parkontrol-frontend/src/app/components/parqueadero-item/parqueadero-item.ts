import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParqueaderoResponseDto } from '../../models/parqueaderos/parqueadero-response.dto';

@Component({
  selector: 'app-parqueadero-item',
  imports: [],
  templateUrl: './parqueadero-item.html',
  styleUrl: './parqueadero-item.scss',
})
export class ParqueaderoItemComponent {

  @Input() parqueadero!: ParqueaderoResponseDto;
  @Output() verDetalleParqueadero= new EventEmitter<number>();
  @Output() abrirModalTarifa = new EventEmitter<number>();

  verDetalle(){
    this.verDetalleParqueadero.emit(this.parqueadero.id);
  }

  modificarTarifa(){
    this.abrirModalTarifa.emit(this.parqueadero.id);
  }


}
