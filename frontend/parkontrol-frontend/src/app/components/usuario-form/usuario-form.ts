import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsuarioResponseDto } from '../../models/usuarios/usuario-response.dto';
import { CreateUsuarioDto } from '../../models/usuarios/crear-usuario.dto';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-usuario-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.scss',
})
export class UsuarioFormComponent {

  @Input() idEmpresa!: number;
  @Output() usuarioCreado = new EventEmitter<UsuarioResponseDto>();

  usuarioForm: FormGroup;
  loading = false;
  mensajeError = '';

  constructor(private authService: AuthService){
    this.usuarioForm = new FormGroup({

      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      correo: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      contrasena: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  registrarUsuario(){
    if (this.usuarioForm.invalid || !this.idEmpresa) return;

    const createUsuarioDto: CreateUsuarioDto = {
      ...this.usuarioForm.value,
      idEmpresa: this.idEmpresa,
    };

    this.loading = true;
    this.authService.registrarUsuario(createUsuarioDto).subscribe({
      next: (usuario : UsuarioResponseDto) => {
        this.loading = false;
        if(usuario){
          this.usuarioCreado.emit(usuario);
        }
      },
      error: (err) => {
        this.loading=false;
        if (err.status === 409) {
          this.mensajeError = 'El correo ya esta registrado.';
        } else if (err.status === 400) {
          this.mensajeError = 'Correo o contraseña invalidos. Verifica los campos.';
        } else {
          this.mensajeError = 'Error inesperado.';
          console.error(err);
        }
      }
    });

  }
}
