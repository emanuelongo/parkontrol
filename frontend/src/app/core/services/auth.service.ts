import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'parkontrol_token';
  private userKey = 'parkontrol_user';

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { correo, contrasena }).pipe(
      map((res: any) => {
        // espera { token: string, user: {...} } desde backend
        return res;
      })
    );
  }

  register(payload: any) {
    return this.http.post(`${environment.apiUrl}/auth/register`, payload);
  }

  storeToken(token: string, user?: any, remember = true) {
    if (remember) {
      localStorage.setItem(this.tokenKey, token);
      if (user) localStorage.setItem(this.userKey, JSON.stringify(user));
    } else {
      sessionStorage.setItem(this.tokenKey, token);
      if (user) sessionStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  getUser() {
    const u = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    return u ? JSON.parse(u) : null;
  }

  isLogged(): boolean {
    return !!this.getToken();
  }
}
