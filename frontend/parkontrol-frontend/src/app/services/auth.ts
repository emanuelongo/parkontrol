import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { CreateUsuarioDto } from '../models/usuarios/crear-usuario.dto';
import { Observable } from 'rxjs';
import { UsuarioResponseDto } from '../models/usuarios/usuario-response.dto';
import { LoginUsuarioDto } from '../models/auth/login-usuario.dto';
import { LoginResponseDto } from '../models/auth/login-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl:string = appsSettings.apiUrl;

  constructor(
    private readonly httpClient: HttpClient,
  ){}

  registrarUsuario(crearUsuarioDto: CreateUsuarioDto): Observable<UsuarioResponseDto>{
    return this.httpClient.post<UsuarioResponseDto>(`${this.baseUrl}auth/register`, crearUsuarioDto)
  }

  login(loginUsuarioDto: LoginUsuarioDto): Observable<LoginResponseDto>{
    return this.httpClient.post<LoginResponseDto>(`${this.baseUrl}auth/login`, loginUsuarioDto)
  }

  
}
