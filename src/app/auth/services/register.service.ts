import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.interface';
import { Observable } from 'rxjs';
import { UsuarioRegister } from '../../dto/UsuarioRegister.dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
constructor(private http: HttpClient) {}
private apiUrl = 'http://localhost:8080/api/usuarios';

crearUsuario(user: UsuarioRegister): Observable<Usuario>{
return this.http.post<Usuario>(this.apiUrl,user);
}

}
