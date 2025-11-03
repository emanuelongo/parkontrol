import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  OcupacionParqueadero, 
  IngresosMensuales, 
  FacturacionCompleta 
} from '../models/vistas.model';

@Injectable({
  providedIn: 'root'
})
export class VistasService {
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  getOcupacion(idEmpresa: number): Observable<OcupacionParqueadero[]> {
    return this.http.get<OcupacionParqueadero[]>(`${this.apiUrl}/views/ocupacion?idEmpresa=${idEmpresa}`);
  }

  getFacturacion(idEmpresa: number): Observable<FacturacionCompleta[]> {
    
    return this.http.get<FacturacionCompleta[]>(`${this.apiUrl}/views/facturacion?idEmpresa=${idEmpresa}`);
  }


  getIngresos(idEmpresa: number): Observable<IngresosMensuales[]> {
    return this.http.get<IngresosMensuales[]>(`${this.apiUrl}/views/ingresos?idEmpresa=${idEmpresa}`);
  }
}