import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../auth/services/token.service';
import { CategoriaPlato } from '../models/categoria-plato.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaPlatoService {
  
  private apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listar(): Observable<CategoriaPlato[]> {
    return this.http.get<CategoriaPlato[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  crear(categoria: CategoriaPlato): Observable<CategoriaPlato> {
    return this.http.post<CategoriaPlato>(this.apiUrl, categoria, { headers: this.getAuthHeaders() });
  }

  actualizar(id: number, categoria: CategoriaPlato): Observable<CategoriaPlato> {
    return this.http.put<CategoriaPlato>(`${this.apiUrl}/${id}`, categoria, { headers: this.getAuthHeaders() });
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
