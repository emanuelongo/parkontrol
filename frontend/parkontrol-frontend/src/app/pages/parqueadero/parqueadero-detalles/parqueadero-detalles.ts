import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParqueaderoConRelacionesDto } from '../../../models/parqueaderos/parqueadero-con-relaciones.dto';
import { DetalleParqueaderoService } from '../../../services/detalle-parqueadero';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parqueadero-detalles',
  imports: [],
  templateUrl: './parqueadero-detalles.html',
  styleUrl: './parqueadero-detalles.scss',
})
export class ParqueaderoDetallesComponent implements OnInit, OnDestroy{

  parqueadero?: ParqueaderoConRelacionesDto;

  constructor(
    private readonly router: Router,
    private readonly detalleParqueaderoService: DetalleParqueaderoService,
  
  ) {}

  ngOnInit(): void {
    this.parqueadero = this.detalleParqueaderoService.getParqueadero();
    if(!this.parqueadero){
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.detalleParqueaderoService.limpiar();
  }

}
