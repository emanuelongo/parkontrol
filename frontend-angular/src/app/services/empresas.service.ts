import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Empresa } from '../models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private apiUrl = environment.urlApi;

  constructor(private http: HttpClient) {}

  // Obtener todas las empresas
  getAll(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/companies`);
  }

  // Buscar empresa por ID (lo que necesitas)
  getById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/companies/${id}`);
  }

  // Crear empresa
  create(empresa: Omit<Empresa, 'id'>): Observable<Empresa> {
    return this.http.post<Empresa>(`${this.apiUrl}/companies`, empresa);
  }

  // Actualizar empresa
  update(id: number, empresa: Partial<Empresa>): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/companies/${id}`, empresa);
  }

  // Eliminar empresa
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/companies/${id}`);
  }
}