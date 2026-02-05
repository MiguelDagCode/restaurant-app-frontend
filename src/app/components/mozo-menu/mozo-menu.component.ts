import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../../auth/services/token.service';
import { LogoutService } from '../../auth/services/logout.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-mozo-menu',
    standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './mozo-menu.html',
  styleUrl: './mozo-menu.css'
})
export class MozoMenuComponent {
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
        this.isInicio = event.urlAfterRedirects === '/mozo-menu';
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
