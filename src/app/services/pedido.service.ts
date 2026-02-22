import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoRequest } from '../models/PedidoRequest';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  // Ajusta a la URL real de tu controlador
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) { }

  registrarPedido(pedido: PedidoRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedido);
  }
}