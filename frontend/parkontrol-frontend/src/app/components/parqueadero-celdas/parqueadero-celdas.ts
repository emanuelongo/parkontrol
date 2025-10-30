import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Celda } from '../../shared/interfaces/celda.interface';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CeldaService } from '../../services/celda';
import { finalize } from 'rxjs';
import { CreateCeldaDto } from '../../models/celdas/crear-celda.dto';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-parqueadero-celdas',
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, 
  ],
  templateUrl: './parqueadero-celdas.html',
  styleUrl: './parqueadero-celdas.scss',
})
export class ParqueaderoCeldasComponent implements OnChanges {

  @Input() idParqueadero?: number;

  crearForm: FormGroup;
  celdas: Celda[] = [];
  loading = false;
  error = '';

  constructor(private readonly celdasService: CeldaService) {
    this.crearForm = new FormGroup({
      idTipoCelda: new FormControl(null, [Validators.required]),
      idSensor: new FormControl(null, [Validators.required]),
      estado: new FormControl('LIBRE', [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idParqueadero'] && this.idParqueadero != null) {
      this.loadCeldas(this.idParqueadero);

    }
  }

  loadCeldas(id: number) {
    this.loading = true;
    this.error = '';
    this.celdasService.getCeldasByParqueadero(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (lista) => (this.celdas = lista || []),
        error: (err) => {
          this.error = 'No se pudo cargar las celdas';
          console.error( err);
        },
      });
  }

  submitCrear() {
    if (!this.idParqueadero) return;
    if (this.crearForm.invalid) return;

    const dto: CreateCeldaDto = {
      idParqueadero: this.idParqueadero,
      idTipoCelda: Number(this.crearForm.value.idTipoCelda),
      idSensor: Number(this.crearForm.value.idSensor),
      estado: this.crearForm.value.estado,
    };

    this.loading = true;
    this.celdasService.crearCelda(dto)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (nueva) => {
          this.loadCeldas(this.idParqueadero!);
          this.crearForm.reset({ estado: 'LIBRE' });
        },
        error: (err) => {
          this.error = 'No se pudo crear la celda';
          console.error( err);
        },
      });
  }




}
