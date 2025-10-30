import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { TarifaService } from '../../services/tarifa';
import { TipoVehiculo } from '../../shared/interfaces/tipo-vehiculo.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Tarifa } from '../../shared/interfaces/tarifa.interface';
import { TipoVehiculoService } from '../../services/tipo-vehiculo';
import { CrearTarifaDto } from '../../models/tarifas/crear-tarifa.dto';
import { MatTableModule } from '@angular/material/table';
import { ActualizarTarifaDto } from '../../models/tarifas/actualizar-tarifa.dto';
import { TarifaResponseDto } from '../../models/tarifas/tarifa-response.dto';

@Component({
  selector: 'app-tarifa-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './tarifa-modal.html',
  styleUrl: './tarifa-modal.scss',

})
export class TarifaModalComponent implements OnInit{

  tarifas: TarifaResponseDto[]= []
  tiposVehiculo: TipoVehiculo[]= [];
  tarifaForm: FormGroup

  mensajeError ='';
  loadingTarifa= false;
  loadingTipoVehiculo= false;
  editando= true;
  tarifaEditandoId?: number;
  huboCambios = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { idParqueadero: number },
    private readonly tarifaService: TarifaService,
    private readonly tipoVehiculoService: TipoVehiculoService,
    private readonly dialogRef: MatDialogRef<TarifaModalComponent>,
  ){

    this.tarifaForm = new FormGroup({
      tipoVehiculoId: new FormControl('', [Validators.required,]),
      precioFraccionHora: new FormControl('', [
        Validators.required,
        Validators.min(0)
      ]),
      precioHoraAdicional: new FormControl('', [
        Validators.required,
        Validators.min(0)
      ]),
    })
  }

  ngOnInit(): void {
    this.cargarTarifas();
    this.cargarTiposVehiculo();
  }

  cargarTarifas(){
    this.loadingTarifa = true;
    this.tarifaService.getTarifasByParqueadero(this.data.idParqueadero).subscribe({
      next: (tarifas) => {
        this.tarifas = tarifas;
        this.loadingTarifa = false;
      },
      error: (err) => {
        this.loadingTarifa = false;
        this.mensajeError= 'No se cargaron las tarifas desde la base de datos';
        console.error(err)
      }
    });
  }

  cargarTiposVehiculo(){
    this.loadingTipoVehiculo= true;
    this.tipoVehiculoService.obtenerTodos().subscribe({
      next: (tiposVehiculo) => {
        this.tiposVehiculo = tiposVehiculo;
        this.loadingTipoVehiculo = false;
      },
      error: (err) => {
        this.loadingTipoVehiculo = false;
        this.mensajeError= 'No se cargaron las tipos de vehiculo desde la base de datos';
        console.error(err)
      }
    });  
  }

  guardarTarifa(){
    if (this.tarifaForm.invalid) return;

    this.loadingTarifa = true;
    const form = this.tarifaForm.value;

    const actualizarDto: ActualizarTarifaDto = {
      precioFraccionHora: form.precioFraccionHora,
      precioHoraAdicional: form.precioHoraAdicional,
      idTipoVehiculo: form.tipoVehiculoId,
    };

    const crearDto: CrearTarifaDto = {
      idParqueadero: this.data.idParqueadero,
      idTipoVehiculo: form.tipoVehiculoId,
      precioFraccionHora: form.precioFraccionHora,
      precioHoraAdicional: form.precioHoraAdicional
    };

    const request$ = (this.editando && this.tarifaEditandoId)
      ? this.tarifaService.actualizarTarifa(this.tarifaEditandoId, actualizarDto)
      : this.tarifaService.crearTarifa(crearDto);

    request$
      .subscribe({
        next: () => {
          this.huboCambios = true;
          this.resetFormulario();
          this.cargarTarifas();
        },
        error: (err) => {
          this.mensajeError = this.editando ? 'Error al actualizar la tarifa.' : 'Error al crear la tarifa.';
          console.error(err);
        }
    });
  }

  
  public editarTarifa(tarifa: TarifaResponseDto):void {
    this.editando = true;
    this.tarifaEditandoId = tarifa.id;
    this.tarifaForm.patchValue({
      tipoVehiculoId: tarifa.tipoVehiculo.id,
      precioFraccionHora: tarifa.precioFraccionHora,
      precioHoraAdicional: tarifa.precioHoraAdicional ?? null,
    });
  }


  eliminarTarifa(idTarifa: number){
    if (!confirm('¿Seguro deseas eliminar esta tarifa?')) return;

    this.tarifaService.eliminarTarifa( idTarifa).subscribe({
      next: () => {
        this.loadingTarifa = false;
        this.huboCambios= true
        this.cargarTarifas();
      },
      error: (err) => {
        this.loadingTarifa = false;
        this.mensajeError = 'Error al eliminar tarifa',
        console.error(err);
      } 
    });
  }

  resetFormulario() {
    this.tarifaForm.reset();
    this.editando = false;
    this.tarifaEditandoId = undefined;
  }

  cerrarModal(){
    this.dialogRef.close(this.huboCambios);
  }


}
