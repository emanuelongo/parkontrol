import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa';
import { CrearEmpresaDto } from '../../models/empresas/crear-empresa.dto';
import { Empresa } from '../../shared/interfaces/empresa.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmpresaResponseDto } from '../../models/empresas/empresa-response.dto';

@Component({
  selector: 'app-empresa-form',
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule],

  templateUrl: './empresa-form.html',
  styleUrl: './empresa-form.scss',
})
export class EmpresaFormComponent {

  empresaForm: FormGroup;
  loading= false;
  mensajeError='';

  @Output() empresaCreada = new EventEmitter<number>();

  constructor( private empresaService: EmpresaService ){

    this.empresaForm = new FormGroup({
      nit: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    
    nombre: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      ]),
    });
  }

  crearEmpresa(){
    if (this.empresaForm.invalid) return;

    const crearEmpresaDto: CrearEmpresaDto = {
      ...this.empresaForm.value,
    }
    this.loading=true;
    this.empresaService.crearEmpresa(crearEmpresaDto).subscribe({
      next: (empresa: EmpresaResponseDto) => {
        this.loading = false;
        if (empresa && empresa.id) {
          this.empresaCreada.emit(empresa.id);
        }
      },
      error: (err) => {
        this.loading = false;
      
        if (err.status === 400) {
          this.mensajeError = 'Datos invalidos, revisa los campos.';
        } else {
          this.mensajeError = 'Error inesperado.';
          console.error(err);
        }
      }
    });
  }

}
