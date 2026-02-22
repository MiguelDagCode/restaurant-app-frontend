import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private apiUrl = 'http://localhost:8080/api/mesas';

  constructor(private http: HttpClient) { }

  // 1. Listar todas las mesas (Recibe el arreglo directamente)
  listarMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  // 2. Buscar por ID
  obtenerMesaPorId(id: number): Observable<Mesa> {
    return this.http.get<Mesa>(`${this.apiUrl}/${id}`);
  }

  // 3. Crear una nueva mesa
  crearMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesa);
  }

  // 4. Actualizar una mesa
  actualizarMesa(id: number, mesa: Mesa): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}`, mesa);
  }

  // 5. Mantenimiento
  enviarAMantenimiento(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/mantenimiento`, {});
  }
}