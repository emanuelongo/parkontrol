import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Empresas
  getEmpresas() { return this.http.get(`${this.base}/empresas`); }
  getEmpresa(id: number) { return this.http.get(`${this.base}/empresas/${id}`); }
  createEmpresa(payload: any) { return this.http.post(`${this.base}/empresas`, payload); }

  // Celdas
  getCeldas() { return this.http.get(`${this.base}/celdas`); }

  // Vehiculos
  getVehiculos() { return this.http.get(`${this.base}/vehiculos`); }

  // Reservas
  createReserva(payload: any) { return this.http.post(`${this.base}/reservas`, payload); }

  // Pagos
  createPago(payload: any) { return this.http.post(`${this.base}/pagos`, payload); }
}
