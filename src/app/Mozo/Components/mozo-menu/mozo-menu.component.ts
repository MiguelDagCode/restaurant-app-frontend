import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';

// Interfaz para tipar los datos de la mesa
export interface Mesa {
  id: number;
  numero: number;
  asientos: number;
  estado: 'disponible' | 'ocupada';
}

@Component({
  selector: 'app-mozo-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mozo-menu.html',
  styleUrl: './mozo-menu.css'
})
export class MozoMenuComponent implements OnInit{
usuarioEmail: string = 'mozo@delifast.com';
  
  // Datos simulados (Mock) para el grid de mesas
  mesas: Mesa[] = [
    { id: 1, numero: 1, asientos: 4, estado: 'disponible' },
    { id: 2, numero: 2, asientos: 2, estado: 'ocupada' }, // Ocupada de prueba
    { id: 3, numero: 3, asientos: 6, estado: 'disponible' },
    { id: 4, numero: 4, asientos: 4, estado: 'disponible' },
    { id: 5, numero: 5, asientos: 2, estado: 'disponible' },
    { id: 6, numero: 6, asientos: 8, estado: 'disponible' },
    { id: 7, numero: 7, asientos: 4, estado: 'ocupada' }, // Ocupada de prueba
    { id: 8, numero: 8, asientos: 4, estado: 'disponible' },
    { id: 9, numero: 9, asientos: 6, estado: 'disponible' },
  ];

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit(): void {
    // Si tienes el método getUserName() en tu TokenService, puedes usarlo así:
    // this.usuarioEmail = this.tokenService.getUserName() || 'mozo@delifast.com';
  }

  // Acción al hacer clic en una mesa
  seleccionarMesa(mesa: Mesa): void {
    if (mesa.estado === 'ocupada') {
      console.log(`Abriendo detalle de la mesa ${mesa.numero} ya ocupada...`);
      // Redirigir a la vista de agregar más pedidos o cobrar
    } else {
      console.log(`Iniciando nueva atención en la mesa ${mesa.numero}...`);
      // Redirigir a la vista del menú para tomar un pedido nuevo
    }
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
