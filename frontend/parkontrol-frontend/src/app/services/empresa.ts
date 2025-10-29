import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { CrearEmpresaDto } from '../models/empresas/crear-empresa.dto';
import { Observable } from 'rxjs';
import { Empresa } from '../shared/interfaces/empresa.interface';
import { EmpresaResponseDto } from '../models/empresas/empresa-response.dto';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly baseUrl:string = appsSettings.apiUrl;
  
  constructor(private readonly httpClient: HttpClient){}

  crearEmpresa(crearEmpresaDto: CrearEmpresaDto): Observable<Empresa>{
    return this.httpClient.post<Empresa>(`${this.baseUrl}empresas`, crearEmpresaDto)
  }

  obtenerEmpresaById(empresaId: number): Observable<EmpresaResponseDto>{
    return this.httpClient.get<EmpresaResponseDto>(`${this.baseUrl}empresas/${empresaId}`);
  }

}
