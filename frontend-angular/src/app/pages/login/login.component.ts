import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/autenticacion.service';
import { LoginUsuarioDto } from '../../models/usuario.model';
import { RolUsuario } from '../../models/shared.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      const credentials: LoginUsuarioDto = {
        correo: this.loginForm.value.correo,
        contrasena: this.loginForm.value.contrasena
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          
          const currentUser = this.authService.getUsuarioActual();
          
          if (currentUser && currentUser.rol === RolUsuario.ADMINISTRADOR) {
            this.router.navigate(['/dashboard']);
          } else if (currentUser && currentUser.rol === RolUsuario.OPERADOR) {
            this.router.navigate(['/operador-dashboard']);
          } else {
            this.router.navigate(['/login']);
          }
        },

        error: (error) => {
          this.loading = false;
          console.error('Error en el login:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Credenciales incorrectas, verifica otra vez tu correo y contraseña';
          } else if (error.status === 0) {
            this.errorMessage = 'Error de conexion verificar el servidor';
          } else if (error.status === 500) {
            this.errorMessage = 'Error del servidor.';
          }
          setTimeout(() => {
          this.errorMessage = '';
          }, 5000);

        },
        complete: () => {
          this.loading = false;
        }
      });
    }
    }

}