import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../models/Rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  crear(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol);
  }

  actualizar(id: number, rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol);
  }

  cambiarEstado(id: number): Observable<void> {
    // Es un PATCH sin body, por eso enviamos {}
    return this.http.patch<void>(`${this.apiUrl}/${id}/cambiar-estado`, {});
  }
}