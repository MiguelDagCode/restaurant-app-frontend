import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../interface/loginRequest';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html', // Asegúrate que coincida con tu archivo
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  loginRequest: LoginRequest = { correo: '', password: '' };
  errorMessage: string | null = null;
  isLoading = false; // Para deshabilitar el botón mientras carga
  showPassword = false; // Nueva variable para el ojito

  constructor(private authService: AuthService) { }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (!this.loginRequest.correo || !this.loginRequest.password) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        // Ya no decodificamos aquí. El servicio sabe qué hacer.
        this.authService.redirectBasedOnRole();
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        if (err.status === 401) {
          this.errorMessage = 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
        }
      }
    });
  }
}