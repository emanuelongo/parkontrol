import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { Observable } from 'rxjs';
import { CrearTarifaDto } from '../models/tarifas/crear-tarifa.dto';
import { ActualizarTarifaDto } from '../models/tarifas/actualizar-tarifa.dto';
import { Tarifa } from '../shared/interfaces/tarifa.interface';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  private readonly baseUrl:string = appsSettings.apiUrl;
  
  constructor(private readonly httpClient: HttpClient){}

  getTarifasByParqueadero(idParqueadero: number): Observable<Tarifa[]>{
    return this.httpClient.get<Tarifa[]>(`${this.baseUrl}parqueaderos/${idParqueadero}/tarifas`);
  }

  crearTarifa(crearTarifaDto: CrearTarifaDto): Observable<Tarifa>{
    return this.httpClient.post<Tarifa>(`${this.baseUrl}parqueaderos/${crearTarifaDto.idParqueadero}/tarifas`, crearTarifaDto);
  }

  actualizarTarifa(idParqueadero: number, idTarifa: number, actualizarTarifaDto : ActualizarTarifaDto): Observable<Tarifa>{
    return this.httpClient.put<Tarifa>(`${this.baseUrl}parqueaderos/${idParqueadero}/tarifas/${idTarifa}`, actualizarTarifaDto);
  }

  eliminarTarifa(idParqueadero: number, idTarifa: number): Observable<void>{
    return this.httpClient.delete<void>(`${this.baseUrl}parqueaderos/${idParqueadero}/tarifas/${idTarifa}`);
  }
}
