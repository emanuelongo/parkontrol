import { Injectable } from '@angular/core';
import { appsSettings } from '../settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { OcupacionParqueaderoDto } from '../shared/interfaces/ocupacion-parqueadero.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VistasService {

  private readonly baseUrl:string = appsSettings.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getOcupacionByParqueadero(idParqueadero: number): Observable<OcupacionParqueaderoDto> {
    return this.http.get<OcupacionParqueaderoDto>(`${this.baseUrl}views/ocupacion/${idParqueadero}`);
  }
  
}
