import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoResponse } from '../models/PedidoResponse';
@Injectable({
  providedIn: 'root'
})
export class CocinaService {
  
  // ¡OJO AQUÍ! Apuntamos al microservicio falso que expone Feign (Puerto 8081)
  private apiUrl = 'http://localhost:8081/api/cocina/pedidos';

  constructor(private http: HttpClient) { }

  listarPedidosCocina(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.apiUrl);
  }

  iniciarPreparacion(idPedido: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idPedido}/iniciar`, {});
  }

  finalizarPreparacion(idPedido: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${idPedido}/finalizar`, {});
  }
}