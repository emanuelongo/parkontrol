import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParqueaderoService } from '../../../services/parqueadero';
import { Parqueadero } from '../../../shared/interfaces/parqueadero.interface';
import { MatCardModule } from '@angular/material/card';
import { ParqueaderoCeldasComponent } from '../../../components/parqueadero-celdas/parqueadero-celdas';
import { ParqueaderoOcupacionComponent } from '../../../components/parqueadero-ocupacion/parqueadero-ocupacion';

@Component({
  selector: 'app-parqueadero-detalles',
  imports: [
    MatCardModule,
    ParqueaderoCeldasComponent,
    ParqueaderoOcupacionComponent,
  ],
  templateUrl: './parqueadero-detalles.html',
  styleUrl: './parqueadero-detalles.scss',
})
export class ParqueaderoDetallesComponent{

  parqueaderoId!: number;
  parqueadero?: Parqueadero;
  loading = false;
  error = '';

  constructor(
    private readonly router: ActivatedRoute,
    private readonly parqueaderoService: ParqueaderoService,  
  ) {}

  ngOnInit(): void {
    this.parqueaderoId = Number(this.router.snapshot.paramMap.get('id'));
    this.loadParqueadero(this.parqueaderoId);
  }

  private loadParqueadero(id: number) {
    this.loading = true;
    this.error = '';
    this.parqueadero = undefined;
    this.parqueaderoService.obtenerDetalle(id).subscribe({
      next: (data) => {
        this.parqueadero = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error al obtener detalle';
        this.loading = false;
      },

    });
  }
}
