import { Component, OnInit } from '@angular/core';
import { EmpresaResponseDto } from '../../models/empresas/empresa-response.dto';
import { ParqueaderoConRelacionesDto } from '../../models/parqueaderos/parqueadero-con-relaciones.dto';
import { UsuarioResponseDto } from '../../models/usuarios/usuario-response.dto';
import { EmpresaService } from '../../services/empresa';
import { ParqueaderoService } from '../../services/parqueadero';
import { SessionService } from '../../services/session';
import { EmpresaInfoComponent } from '../../components/empresa-info/empresa-info';
import { ParqueaderoListaComponent } from '../../components/parqueadero-lista/parqueadero-lista';
import { DetalleParqueaderoService } from '../../services/detalle-parqueadero';
import { Router } from '@angular/router';
import { TarifaModalComponent } from '../../components/tarifa-modal/tarifa-modal';
import { MatDialog } from '@angular/material/dialog';

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
  parqueaderos: ParqueaderoConRelacionesDto[] = [];
  usuario?: UsuarioResponseDto | null = null;

  loadingEmpresa = false;
  loadingParqueaderos=false;
  mensajeError='';

  modalTarifaIsVisible= false;
  parqueaderoSeleccionadoId?: number;

  constructor(
    private readonly empresaService: EmpresaService,
    private readonly parqueaderoService: ParqueaderoService,
    private readonly sessionService: SessionService,
    private readonly detalleParqueaderoService: DetalleParqueaderoService,
    private readonly dialog: MatDialog,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.usuario = this.sessionService.obtenerUsuario();

    if(this.usuario?.idEmpresa) {
      this.cargarEmpresa(this.usuario.idEmpresa);
      this.cargarParqueaderos(this.usuario.idEmpresa);
    }
  }

  cargarEmpresa(idEmpresa: number){
    this.loadingEmpresa = true;
    this.empresaService.obtenerEmpresaById(idEmpresa).subscribe({
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

  cargarParqueaderos(idEmpresa: number){
    this.loadingParqueaderos = true;
    this.parqueaderoService.getParqueaderosByEmpresa(idEmpresa).subscribe({
      next: (parqueaderos) => {
        this.loadingParqueaderos = false;
        this.parqueaderos = parqueaderos;
      },
      error: (err) => {
        this.loadingParqueaderos = false;
        this.mensajeError = 'No se pudo cargar los parqueaderos';
        console.error(err);
      }
    });
  }

  onVerDetalleParqueadero(idParqueadero: number) {
    const parqueadero = this.parqueaderos.find(p => p.id === idParqueadero);

    if (!parqueadero) {
      console.error('No se encontró el parqueadero en la lista');
      return;
    }

    this.detalleParqueaderoService.setParqueadero(parqueadero);
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
      this.cargarParqueaderos(this.usuario!.idEmpresa!)
    }
  })
}

}
