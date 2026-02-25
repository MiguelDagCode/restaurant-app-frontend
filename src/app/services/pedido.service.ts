import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoRequest } from '../models/PedidoRequest';
import { PedidoResponse } from '../models/PedidoResponse';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  private apiUrl = 'http://localhost:8080/api/pedidos'; 

  constructor(private http: HttpClient) { }

  // POST: Crear nuevo pedido (El que usa el mozo)
  registrarPedido(pedido: PedidoRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }

  // GET: Listar todos los pedidos (Ideal para el Cajero)
  listarPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.apiUrl);
  }

  // GET: Obtener un pedido por ID
  obtenerPedidoPorId(id: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.apiUrl}/${id}`);
  }
cobrarPedido(idPedido: number): Observable<PedidoResponse> {
    return this.http.patch<PedidoResponse>(`${this.apiUrl}/${idPedido}/cobrar`, {});
  }
}