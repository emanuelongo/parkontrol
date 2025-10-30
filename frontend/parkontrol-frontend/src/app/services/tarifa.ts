import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { Observable } from 'rxjs';
import { CrearTarifaDto } from '../models/tarifas/crear-tarifa.dto';
import { ActualizarTarifaDto } from '../models/tarifas/actualizar-tarifa.dto';
import { TarifaResponseDto } from '../models/tarifas/tarifa-response.dto';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  private readonly baseUrl:string = appsSettings.apiUrl;
  
  constructor(private readonly httpClient: HttpClient){}

  getTarifasByParqueadero(idParqueadero: number): Observable<TarifaResponseDto[]> {
    return this.httpClient.get<TarifaResponseDto[]>(`${this.baseUrl}rates/parqueadero/${idParqueadero}`);
  }

  crearTarifa(crearTarifaDto: CrearTarifaDto): Observable<TarifaResponseDto> {
    return this.httpClient.post<TarifaResponseDto>(`${this.baseUrl}rates`, crearTarifaDto);
  }

  actualizarTarifa(idTarifa: number, actualizarTarifaDto: ActualizarTarifaDto): Observable<TarifaResponseDto> {
    return this.httpClient.patch<TarifaResponseDto>(`${this.baseUrl}rates/${idTarifa}`, actualizarTarifaDto);
  }

  eliminarTarifa(idTarifa: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}rates/${idTarifa}`);
  }
}
