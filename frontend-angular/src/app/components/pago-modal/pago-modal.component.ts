import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CrearPagoDto } from '../../models/pago.model';
import { MetodoPago } from '../../models/shared.model';
import { ReservasService } from '../../services/reservas.service';

export interface PagoDialogData {
  idReserva?: number;
  idParqueadero?: number;
}

@Component({
  selector: 'app-pago-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './pago-modal.component.html',
  styleUrls: ['./pago-modal.component.scss']
})
export class PagoModalComponent implements OnInit {
  pagoForm!: FormGroup;
  loading = false;
  reservasActivas: any[] = [];
  mostrarSelectorReserva = false;

  metodosPago = [
    { id: MetodoPago.EFECTIVO, nombre: 'Efectivo' },
    { id: MetodoPago.TARJETA_CREDITO, nombre: 'Tarjeta de credito' },
    { id: MetodoPago.TARJETA_DEBITO, nombre: 'Tarjeta de debito' },
    { id: MetodoPago.TRANSFERENCIA, nombre: 'Transferencia' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PagoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PagoDialogData,
    private reservasService: ReservasService
  ) {
    // Inicialización en ngOnInit
  }

  ngOnInit(): void {
    if (this.data.idReserva) {
      // Modo 1: Pago para reserva específica
      this.pagoForm = this.formBuilder.group({
        idReserva: [{ value: this.data.idReserva, disabled: true }, [Validators.required]],
        idMetodoPago: [null, [Validators.required]]
      });
      this.mostrarSelectorReserva = false;
    } else if (this.data.idParqueadero) {
      // Modo 2: Selección de reserva abierta por parqueadero
      this.reservasService.getByParqueadero(this.data.idParqueadero).subscribe(reservas => {
        this.reservasActivas = reservas.filter(r => r.estado === 'ABIERTA');
      });
      this.pagoForm = this.formBuilder.group({
        idReserva: [null, [Validators.required]],
        idMetodoPago: [null, [Validators.required]]
      });
      this.mostrarSelectorReserva = true;
    }
  }

  onSubmit(): void {
    if (this.pagoForm.valid) {
      this.loading = true;
      
      const pagoData: CrearPagoDto = {
        idReserva: this.data.idReserva ? this.data.idReserva : this.pagoForm.get('idReserva')?.value,
        idMetodoPago: this.pagoForm.get('idMetodoPago')?.value
      };
      
      this.dialogRef.close(pagoData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getMetodoIcon(metodoId: number): string {
    switch (metodoId) {
      case MetodoPago.EFECTIVO:
        return 'money';
      case MetodoPago.TARJETA_CREDITO:
        return 'credit_card';
      case MetodoPago.TARJETA_DEBITO:
        return 'credit_card';
      case MetodoPago.TRANSFERENCIA:
        return 'account_balance';
      default:
        return 'payment';
    }
  }
}