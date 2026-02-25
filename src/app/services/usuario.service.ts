import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioListResponseDto } from '../dto/UsuarioListResponseDto';
import { UsuarioResponseDto } from '../dto/UsuarioResponseDto';
import { UsuarioCreateDto } from '../dto/UsuarioCreateDto';
import { UsuarioUpdateDto } from '../dto/UsuarioUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  listar(): Observable<UsuarioListResponseDto[]> {
    return this.http.get<UsuarioListResponseDto[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<UsuarioResponseDto> {
    return this.http.get<UsuarioResponseDto>(`${this.apiUrl}/${id}`);
  }

  crear(dto: UsuarioCreateDto): Observable<UsuarioResponseDto> {
    return this.http.post<UsuarioResponseDto>(this.apiUrl, dto);
  }

  actualizar(id: number, dto: UsuarioUpdateDto): Observable<UsuarioResponseDto> {
    return this.http.put<UsuarioResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  cambiarEstado(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado`, {});
  }
}