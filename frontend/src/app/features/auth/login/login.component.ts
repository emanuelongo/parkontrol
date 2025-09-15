import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  remember = true;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.correo, this.contrasena).subscribe({
      next: (res: any) => {
        const token = res.token || res.access_token || res.data?.token;
        const user = res.user || res.data?.user || null;
        if (!token) {
          this.error = 'Respuesta inválida del servidor';
          this.loading = false;
          return;
        }
        this.auth.storeToken(token, user, this.remember);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Credenciales inválidas';
        this.loading = false;
      }
    });
  }
}
