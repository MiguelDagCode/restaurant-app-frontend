import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaMasVendidaDTO } from '../dto/CategoriaMasVendido.dto';
import { PlatoMasVendidoDTO } from '../dto/PlatoMasVendido.dto';
import { TokenService } from '../auth/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ReportAdminService {
   private apiUrl = 'http://localhost:8080/api/reportes'; 

  constructor(private http: HttpClient,  private tokenService: TokenService) {}

  obtenerCategoriasMasVendidas(): Observable<CategoriaMasVendidaDTO[]> {
    const token = this.tokenService.getToken();

    // Agregamos encabezado con token JWT
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<CategoriaMasVendidaDTO[]>(`${this.apiUrl}/categorias`, { headers });
  }

obtenerPlatosPorCategoria(categoriaId: number): Observable<PlatoMasVendidoDTO[]> {
  const token = this.tokenService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<PlatoMasVendidoDTO[]>(`${this.apiUrl}/categorias/${categoriaId}/platos`, { headers });
}

}
