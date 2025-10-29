import { Injectable } from '@angular/core';
import { LoginResponseDto } from '../models/auth/login-response.dto';
import { UsuarioResponseDto } from '../models/usuarios/usuario-response.dto';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'usuario';

  guardarSession(loginResponseDto: LoginResponseDto): void {
    localStorage.setItem(this.TOKEN_KEY, loginResponseDto.access_token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(loginResponseDto.usuario));
  }

  obtenerUsuario(): UsuarioResponseDto | null {
    const usuario= localStorage.getItem(this.USER_KEY);
    return usuario? JSON.parse(usuario) : null;
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  obtenerRol(): string | null {
    return this.obtenerUsuario()?.rol ?? null;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
  
