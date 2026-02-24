import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para *ngFor
import { Router, RouterModule } from '@angular/router'; // Para la navegación
import { TokenService } from '../../../auth/services/token.service';
// Ajusta la ruta a tu servicio

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-menu.html',
  styleUrl: './admin-menu.css'
})
export class AdminMenuComponent implements OnInit{
  //Sacarlo del token o de la sesión en un caso real
adminEmail: string = 'admin@delifast.com'; 



  constructor(private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
  }
  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}//EJEMPLO DE USO DEL TOKEN SERVICE PARA OBTENER EL EMAIL DEL ADMINISTRADOR