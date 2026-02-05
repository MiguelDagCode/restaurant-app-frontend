import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.interface';
import { EstadoPedido } from '../enums/estado-pedido.enum';
import { TokenService } from '../auth/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService // 👈 Inyectamos el servicio del token
  ) {}

  /** 🔒 Devuelve encabezados con el token JWT */
  private getAuthHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /** 📋 Listar pedidos */
  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  /** 🔎 Obtener pedido por ID */
  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  /** ➕ Crear nuevo pedido */
  crear(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido, { headers: this.getAuthHeaders() });
  }

  /** ✏️ Actualizar pedido */
  actualizar(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido, { headers: this.getAuthHeaders() });
  }

  /** ❌ Eliminar pedido */
  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  /** 🔄 Cambiar estado del pedido */
  cambiarEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(
      `${this.apiUrl}/${id}/estado?estado=${estado}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}