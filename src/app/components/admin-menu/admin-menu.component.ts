import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from '../../auth/services/token.service';
import { LogoutService } from '../../auth/services/logout.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.css'
})
export class AdminMenuComponent {
  usuarioLogueado: any;
  isInicio: boolean = true;

  constructor(
    private tokenService: TokenService,
    private logoutService: LogoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isInicio = event.urlAfterRedirects === '/admin-menu';
      }
    });

    const token = this.tokenService.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.usuarioLogueado = {
          nombre: decodedToken.nombre,
          apellidos: decodedToken.apellidos
        };
      } catch (error) {
        this.usuarioLogueado = null;
      }
    }
  }

  onLogout(): void {
    this.logoutService.logout().subscribe({
      next: () => {
        this.logoutService.clearSessionAndRedirect();
      },
      error: (err) => {
        this.logoutService.clearSessionAndRedirect();
      }
    });
  }
}
