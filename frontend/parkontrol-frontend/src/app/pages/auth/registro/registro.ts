import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { EmpresaFormComponent } from '../../../components/empresa-form/empresa-form';
import { UsuarioFormComponent } from '../../../components/usuario-form/usuario-form';
import { UsuarioResponseDto } from '../../../models/usuarios/usuario-response.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [
    MatStepperModule,
    MatButtonModule,
    EmpresaFormComponent,
    UsuarioFormComponent,
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class RegistroComponent {

  idEmpresaCreada?: number;
  usuarioCreado?: UsuarioResponseDto;
  empresaCompletada = false;
  usuarioCompletado = false;

  constructor(private router: Router) {}

  onEmpresaCreada(idEmpresa: number){
    this.idEmpresaCreada = idEmpresa;
    this.empresaCompletada= true;
  }

  onUsuarioCreado(usuario: UsuarioResponseDto){
    this.usuarioCompletado = true;
    this.usuarioCreado= usuario;
    alert('Registro completado, Bienvenido a parkontrol');
    this.router.navigate(['/auth/login']);
  }


  


}
