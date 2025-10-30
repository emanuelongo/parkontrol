import { Component, OnInit } from '@angular/core';
import { EmpresaResponseDto } from '../../models/empresas/empresa-response.dto';
import { EmpresaService } from '../../services/empresa';
import { ParqueaderoService } from '../../services/parqueadero';
import { SessionService } from '../../services/session';
import { EmpresaInfoComponent } from '../../components/empresa-info/empresa-info';
import { ParqueaderoListaComponent } from '../../components/parqueadero-lista/parqueadero-lista';
import { Router } from '@angular/router';
import { TarifaModalComponent } from '../../components/tarifa-modal/tarifa-modal';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioSessionDto } from '../../models/usuarios/usuario-session.dto';
import { ParqueaderoResponseDto } from '../../models/parqueaderos/parqueadero-response.dto';

@Component({
  selector: 'app-dashboard',
  imports: [
    EmpresaInfoComponent,
    ParqueaderoListaComponent,
    
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit{

  empresa?: EmpresaResponseDto;
  parqueaderos: ParqueaderoResponseDto[] = [];
  usuario?: UsuarioSessionDto | null = null;

  loadingEmpresa = false;
  loadingParqueaderos=false;
  mensajeError='';

  modalTarifaIsVisible= false;
  parqueaderoSeleccionadoId?: number;

  constructor(
    private readonly empresaService: EmpresaService,
    private readonly parqueaderoService: ParqueaderoService,
    private readonly sessionService: SessionService,
    private readonly dialog: MatDialog,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.usuario = this.sessionService.obtenerUsuario();

    if(this.usuario?.idEmpresa) {
      this.cargarEmpresa(this.usuario.idEmpresa);
      this.cargarParqueaderos();
    }
  }

  cargarEmpresa(idEmpresa: number){
    this.loadingEmpresa = true;
    this.empresaService.obtenerEmpresa().subscribe({
      next: (empresa) => {
        this.loadingEmpresa = false;
        this.empresa= empresa;
      },
      error: (err) => {
        this.loadingEmpresa = false;
        this.mensajeError ='No se cargo la informacion de la empresa'
        console.log(err);
      }
    });
  }

  cargarParqueaderos() {
    if (!this.sessionService.obtenerToken()) {
      this.loadingParqueaderos = false;
      this.mensajeError = 'No autenticado: token no encontrado';
      console.error('Token ausente');
      return;
    }
  

    this.loadingParqueaderos = true;
    this.parqueaderoService.getParqueaderosByEmpresa().subscribe({
      next: (parqueaderos) => {
        this.loadingParqueaderos = false;
        this.parqueaderos = parqueaderos;
        },
        error: (err) => {
          this.loadingParqueaderos = false;
          this.mensajeError = 'No se pudo cargar los parqueaderos';
          console.error('cargarParqueaderos error:', err.status, err.error ?? err.message ?? err);
          }
        });
      }

    onVerDetalleParqueadero(idParqueadero: number) {
      const parqueadero = this.parqueaderos.find(p => p.id === idParqueadero);

      if (!parqueadero) {
        console.error('No se encontró el parqueadero en la lista');
        return;
      }
      //Le envio el id del parqueadero por la ruta 
      this.router.navigate(['parqueadero', parqueadero.id]);
    }

    onAbrirModalTarifa(idParqueadero: number) {
      const dialogRef = this.dialog.open(TarifaModalComponent, {
        width: '600px',
        data: {idParqueadero},
        disableClose: true,
      })

      dialogRef.afterClosed().subscribe((actualizado) => {
        if (actualizado){
          this.cargarParqueaderos();
        }
      })
    }

}
