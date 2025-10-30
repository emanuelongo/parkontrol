import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParqueaderoConRelacionesDto } from '../models/parqueaderos/parqueadero-con-relaciones.dto';
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

  getParqueaderoById(id: number): Observable<ParqueaderoConRelacionesDto>{
    return this.httpClient.get<ParqueaderoConRelacionesDto>(`${this.baseUrl}parqueaderos/${id}`);
  }
  
}
