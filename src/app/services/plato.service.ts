import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plato } from '../models/plato.interface';
import { TokenService } from '../auth/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class PlatoService {
 private apiUrl = 'http://localhost:8080/api/platos';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listar(): Observable<Plato[]> {
    return this.http.get<Plato[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  obtener(id: number): Observable<Plato> {
    return this.http.get<Plato>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  crear(plato: Plato): Observable<Plato> {
    return this.http.post<Plato>(this.apiUrl, plato, { headers: this.getAuthHeaders() });
  }

  actualizar(id: number, plato: Plato): Observable<Plato> {
    return this.http.put<Plato>(`${this.apiUrl}/${id}`, plato, { headers: this.getAuthHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
