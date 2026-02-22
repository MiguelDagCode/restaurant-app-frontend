import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriaConProductosDto } from '../models/CategoriaConProductosDto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Ajusta la URL al endpoint real de tu controlador de Productos
  private apiUrl = 'http://localhost:8080/api/productos/categorias/con-productos'; 

  constructor(private http: HttpClient) { }

  obtenerCatologoAgrupado(): Observable<CategoriaConProductosDto[]> {
    // Al igual que con las mesas, esperamos que el backend devuelva la lista directa
    return this.http.get<CategoriaConProductosDto[]>(this.apiUrl);
  }
}
