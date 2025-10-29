import { Component } from '@angular/core';

@Component({
  selector: 'app-parqueadero-item',
  imports: [],
  templateUrl: './parqueadero-item.html',
  styleUrl: './parqueadero-item.scss',
})
export class ParqueaderoItem {

  parqueadero =  {
    nombre: 'Parqueadero Norte - sede corporativa ',
    direccion: 'Av. 30 # 45 - 12',
    ingresosHoy: 9,
    ocupadasMotos: 3,
    ocupadasCarros: 5,
    ocupadasBicicletas: 1
  }

}
