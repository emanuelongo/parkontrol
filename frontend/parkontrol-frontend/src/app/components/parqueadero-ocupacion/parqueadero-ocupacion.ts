import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OcupacionParqueaderoDto } from '../../shared/interfaces/ocupacion-parqueadero.dto';
import { VistasService } from '../../services/vistas';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-parqueadero-ocupacion',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './parqueadero-ocupacion.html',
  styleUrl: './parqueadero-ocupacion.scss',
})
export class ParqueaderoOcupacionComponent implements OnChanges {

  @Input() idParqueadero?: number;

  ocupacion?: OcupacionParqueaderoDto | null;
  loading = false;
  error = '';

  constructor(private readonly vistasService: VistasService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idParqueadero'] && this.idParqueadero !== null) {
      this.loadOcupacion(this.idParqueadero!);
    }
  }

  private loadOcupacion(id: number) {
    this.loading = true;
    this.error = '';
    this.ocupacion = undefined;

    this.vistasService.getOcupacionByParqueadero(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          this.ocupacion = data;
        },
        error: (err) => {
          this.error = 'No se pudo cargar la ocupacion del parqueadero';
          console.error(err);
        },
      });
    }

  get porcentajeOcupacion(): number {
    if (!this.ocupacion || this.ocupacion.totalCeldas === 0) return 0;
    return Math.round((this.ocupacion.celdasOcupadas / this.ocupacion.totalCeldas) * 100);
  }

}
