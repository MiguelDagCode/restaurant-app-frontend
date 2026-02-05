import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../interface/loginRequest';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
loginRequest : LoginRequest={
  correo: '',
  contrasena: ''
};
 errorMessage: string | null = null;

 constructor(
  private loginService: LoginService,
  private router: Router,
  private tokenService: TokenService
 ){ }

 onLogin(): void {
    this.tokenService.removeToken();
    this.loginService.Login(this.loginRequest).subscribe({
      next: (response) => {
        const token = response.token;
        this.tokenService.setToken(token);
        this.errorMessage = null;

        // 🔹 Decodificar el token para obtener el rol
        const decodedToken: any = jwtDecode(token);
        const userRole = decodedToken.rol;

        switch (userRole) {
          case 'ROLE_ADMIN':
            this.router.navigate(['/admin-menu']);
            break;
          case 'ROLE_MOZO':
            this.router.navigate(['/mozo-menu']);
            break;
          case 'ROLE_CAJERO':
            this.router.navigate(['/cajero-menu']);
            break;
          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login fallido:', err);
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    });
  }
irARegistro(): void {
  this.router.navigate(['/register']);
}

}
