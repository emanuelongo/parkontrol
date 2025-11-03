import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo, CrearVehiculoDto } from '../models/vehiculo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private readonly apiUrl = `${environment.urlApi}/vehicles`;

  constructor(private http: HttpClient) {}

  /**
   * Buscar vehículo por placa
   */
  getByPlaca(placa: string): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/placa/${placa}`);
  }

  /**
   * Crear nuevo vehículo
   */
  create(vehiculoData: CrearVehiculoDto): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.apiUrl, vehiculoData);
  }

  /**
   * Obtener vehículo por ID
   */
  getById(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/${id}`);
  }
}
