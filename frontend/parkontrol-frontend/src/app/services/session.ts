import { Injectable } from '@angular/core';
import { LoginResponseDto } from '../models/auth/login-response.dto';
import { jwtDecode } from 'jwt-decode';
import { UsuarioSessionDto } from '../models/usuarios/usuario-session.dto';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'usuario';

  guardarToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const payload = this.decodificarToken(token)
    if (payload){
      localStorage.setItem(this.USER_KEY, JSON.stringify(payload));
    }
    
  }

  private decodificarToken(token: string): UsuarioSessionDto | null {
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id,
        correo: decoded.correo,
        nombreRol: decoded.nombreRol,
        idEmpresa: decoded.idEmpresa 
      };
    } catch {
      return null;
    }
  }

  obtenerUsuario(): UsuarioSessionDto | null {
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
    return this.obtenerUsuario()?.nombreRol ?? null;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
  
