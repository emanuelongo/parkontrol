import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReservasService } from '../../services/reservas.service';
import { ParqueaderosService } from '../../services/parqueaderos.service';
import { AuthService } from '../../services/autenticacion.service';
import { Reserva, CrearReservaDto } from '../../models/reserva.model';
import { Parqueadero } from '../../models/parqueadero.model';
import { EstadoReserva } from '../../models/shared.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { FiltroParqueaderosComponent } from '../../components/filtro-parqueaderos/filtro-parqueaderos.component';
import { ReservaModalComponent, ReservaDialogData } from '../../components/reserva-modal/reserva-modal.component';


@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    FiltroParqueaderosComponent
  ],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {
  
  reservas: Reserva[] = [];
  parqueaderos: Parqueadero[] = [];
  loading = false;
  parqueaderoSeleccionado: number | null = null;
  errorMessage = '';

  displayedColumns: string[] = ['id', 'vehiculo', 'fechaEntrada', 'fechaSalida', 'monto', 'estado', 'acciones'];

  constructor(
    private reservasService: ReservasService,
    private parqueaderosService: ParqueaderosService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarParqueaderos();
  }

  private cargarParqueaderos(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario || !usuario.idEmpresa) {

      console.error('No hay usuario autenticado');
      return;
    }

    this.loading = true;

    this.parqueaderosService.getByEmpresa(usuario.idEmpresa).subscribe({

      next: (parqueaderos) => {
        this.parqueaderos = parqueaderos;
        
        if (parqueaderos.length > 0) {
          this.parqueaderoSeleccionado = parqueaderos[0].id;
          this.cargarReservas(this.parqueaderoSeleccionado);

        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error No cargo parqueaderos', error);
        this.loading = false;

      }});
  }


  private cargarReservas(idParqueadero: number): void {
    this.loading = true;

    this.reservasService.getByParqueadero(idParqueadero).subscribe({

      next: (reservas) => {
        this.reservas = reservas;
        this.loading = false;
      },
      error: (error) => {
        console.error('no cargo reservas', error);
        this.reservas = [];
        this.loading = false;
      }
    });
  }

  onParqueaderoCambia(idParqueadero: number): void {
    this.parqueaderoSeleccionado = idParqueadero;
    this.cargarReservas(idParqueadero);
  }

  abrirModalCrear(): void {
    if (!this.parqueaderoSeleccionado) return;

    const dataParqueadero: ReservaDialogData = {
      idParqueadero: this.parqueaderoSeleccionado
    };


    const dialogRef = this.dialog.open(ReservaModalComponent, {
      width: '600px',
      data: dataParqueadero,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearReserva(result);
      }
    });
  }

  private crearReserva(reservaData: CrearReservaDto): void {
    
    this.reservasService.create(reservaData).subscribe({
      next: () => {

        console.log('Reserva creada exitosamente');
        if (this.parqueaderoSeleccionado) {
          this.cargarReservas(this.parqueaderoSeleccionado);
        }
      },
      error: (error) => {
        console.error('Error al crear reserva:', error);
        
        if (error.status === 400) {
          if (error.error?.message?.includes('LIBRE')) {
            this.errorMessage = 'La celda seleccionada esta OCUPADA';
          } else {
            this.errorMessage = 'Error en los datos de la reserva';
          }
        } else {
          this.errorMessage = 'Error no pudo crear la reserva';
        }
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });


  }

  finalizarReserva(reserva: Reserva): void { 
    this.reservasService.finalizar(reserva.id).subscribe({
      next: () => {
        console.log('Reserva finalizada exitosamente');
        if (this.parqueaderoSeleccionado) {
          this.cargarReservas(this.parqueaderoSeleccionado);
        }
      },
      error: (error) => {
        console.error('Error al finalizar reserva:', error);
        this.errorMessage = 'Error al finalizar la reserva';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  getEstadoColor(estado: string): string {
    if (estado === EstadoReserva.ABIERTA) {

      return '#2196f3'; 
    }
    return '#4caf50'; 
  }
}