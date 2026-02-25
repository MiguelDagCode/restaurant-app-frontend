import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from '../models/Insumo';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {
  
  private apiUrl = 'http://localhost:8080/api/insumos';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.apiUrl);
  }

  findById(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/${id}`);
  }

  insert(insumo: Insumo): Observable<Insumo> {
    return this.http.post<Insumo>(this.apiUrl, insumo);
  }

  update(id: number, insumo: Insumo): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/${id}`, insumo);
  }
}