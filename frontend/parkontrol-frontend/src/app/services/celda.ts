import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { Celda } from '../shared/interfaces/celda.interface';
import { Observable } from 'rxjs';
import { CreateCeldaDto } from '../models/celdas/crear-celda.dto';

@Injectable({
  providedIn: 'root'
})
export class CeldaService {

  private readonly baseUrl:string = appsSettings.apiUrl;
    
  constructor(private readonly httpClient: HttpClient){}

  getCeldasByParqueadero(idParqueadero: number): Observable<Celda[]> {
    return this.httpClient.get<Celda[]>(`${this.baseUrl}cells/parqueadero/${idParqueadero}`);
  }

  crearCelda(dto: CreateCeldaDto): Observable<Celda> {
    return this.httpClient.post<Celda>(`${this.baseUrl}cells`, dto);
  }
  
}
