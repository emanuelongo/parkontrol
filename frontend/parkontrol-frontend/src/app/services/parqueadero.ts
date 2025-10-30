import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParqueaderoResponseDto } from '../models/parqueaderos/parqueadero-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ParqueaderoService {

  private readonly baseUrl:string = appsSettings.apiUrl;
  
  constructor(private readonly httpClient: HttpClient){}

  getParqueaderosByEmpresa(): Observable<ParqueaderoResponseDto[]> {
    return this.httpClient.get<ParqueaderoResponseDto[]>(`${this.baseUrl}parking-lots`);
  }

  obtenerDetalle(idParqueadero: number): Observable<ParqueaderoResponseDto> {
    return this.httpClient.get<ParqueaderoResponseDto>(`${this.baseUrl}parking-lots/${idParqueadero}`);
  }
  
}
