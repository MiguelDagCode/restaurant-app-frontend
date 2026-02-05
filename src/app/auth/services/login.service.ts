import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../interface/loginResponse';
import { LoginRequest } from '../interface/loginRequest';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = "http://localhost:8080/api/auth/login";

  constructor(private http: HttpClient){

  }

Login(credenciales: LoginRequest):Observable<LoginResponse>{
const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});
return this.http.post<LoginResponse>(this.apiUrl, credenciales, {headers});
}
}

export type {LoginRequest, LoginResponse};
