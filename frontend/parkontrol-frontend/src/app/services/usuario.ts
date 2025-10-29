import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { CreateUsuarioDto } from '../models/usuarios/crear-usuario.dto';
import { Observable } from 'rxjs';
import { UsuarioResponseDto } from '../models/usuarios/usuario-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly baseUrl:string = appsSettings.apiUrl;
  
  constructor(private readonly httpClient: HttpClient){}

  crearUsuario(crearUsuarioDto: CreateUsuarioDto): Observable<UsuarioResponseDto>{
    return this.httpClient.post<UsuarioResponseDto>(`${this.baseUrl}usuarios`, crearUsuarioDto);
  }
  
}
