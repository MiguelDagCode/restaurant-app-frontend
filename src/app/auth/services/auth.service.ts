import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { LoginRequest } from '../interface/loginRequest';
import { LoginResponse } from '../interface/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  
  // Esto es la magia: Un observable que dice si estás logueado o no
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { 
    // Al iniciar la app, verificamos si ya hay un token válido
    this.isLoggedInSubject.next(!this.tokenService.isTokenExpired());
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // El 'tap' nos permite hacer efectos secundarios sin alterar la respuesta
        this.tokenService.setToken(response.token);
        this.isLoggedInSubject.next(true); // ¡Avisamos a toda la app que nos logueamos!
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Método auxiliar para redireccionar según rol
  redirectBasedOnRole(): void {
    const role = this.tokenService.getUserRole();
    switch (role) {
      case 'ADMIN': this.router.navigate(['/admin-menu']); break;
      case 'MOZO': this.router.navigate(['/mozo-menu']); break;
      case 'CAJERO': this.router.navigate(['/cajero-menu']); break;
      case 'COCINERO': this.router.navigate(['/cocina-menu']); break;
      default: this.router.navigate(['/home']); // O a login si prefieres
    }
  }
}