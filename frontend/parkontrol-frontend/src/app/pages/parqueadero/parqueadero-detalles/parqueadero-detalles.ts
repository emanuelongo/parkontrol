import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parqueadero-detalles',
  imports: [],
  templateUrl: './parqueadero-detalles.html',
  styleUrl: './parqueadero-detalles.scss',
})
export class ParqueaderoDetallesComponent{


  constructor(
    private readonly router: Router,  
  ) {}


}
