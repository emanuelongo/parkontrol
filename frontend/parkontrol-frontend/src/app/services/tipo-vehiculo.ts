import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoVehiculo } from '../shared/interfaces/tipo-vehiculo.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculoService {
  
  private readonly baseUrl:string = appsSettings.apiUrl;
  
  constructor(private readonly httpClient: HttpClient){}

  obtenerTodos(): Observable<TipoVehiculo[]>{
      return this.httpClient.get<TipoVehiculo[]>(`${this.baseUrl}tipos-vehiculo`);
    }
}
