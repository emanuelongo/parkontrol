import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUsuarioDto } from '../../../models/auth/login-usuario.dto';
import { LoginResponseDto } from '../../../models/auth/login-response.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SessionService } from '../../../services/session';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  loginForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
  ){

    this.loginForm = new FormGroup({
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

  login(){
    if (this.loginForm.invalid)return;
    const loginUsuarioDto: LoginUsuarioDto ={
      ...this.loginForm.value,
    };
    this.authService.login(loginUsuarioDto).subscribe({
      next: (res: LoginResponseDto) => {

        if(res && res.access_token){
          this.sessionService.guardarToken(res.access_token);
          this.router.navigate(['dashboard'])
        } 
      },
      error: (err) => {
        if(err.status == 401){
          this.mensajeError ='credenciales invalidas';
        } else{ 
          this.mensajeError ='Error inesperado';
          console.error(err);
        } 
      }
    });
  }

}
