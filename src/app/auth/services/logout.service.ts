import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private apiUrl = 'http://localhost:8080/api/auth/logout';

  constructor(
    private http: HttpClient, 
    private tokenService: TokenService, 
    private router: Router){
  }

  logout(): Observable<any> {
    const token = this.tokenService.getToken();
    if (token) {
      return this.http.post(this.apiUrl, { token }, { responseType: 'text' as 'json' });
    } else{
    return of(null);
  }
  }
  
    clearSessionAndRedirect(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
