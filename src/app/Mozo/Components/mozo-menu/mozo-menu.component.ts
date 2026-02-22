import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';
import { MesaService } from '../../../Services/mesa.service';
import { Mesa } from '../../../models/mesa';

@Component({
  selector: 'app-mozo-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mozo-menu.html',
  styleUrl: './mozo-menu.css'
})
export class MozoMenuComponent implements OnInit {
  
  usuarioEmail: string = 'mozo@delifast.com';
  
  // Ahora empieza vacío porque los datos vendrán del backend
  mesas: Mesa[] = [];
  cargando: boolean = true; // Para mostrar un spinner mientras el backend responde

  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private mesaService: MesaService // Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    // this.usuarioEmail = this.tokenService.getUserName() || 'mozo@delifast.com';
    this.cargarMesas();
  }

  // Método para consumir el servicio
  cargarMesas(): void {
    this.mesaService.listarMesas().subscribe({
      next: (data) => {
        this.mesas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar las mesas desde el servidor', err);
        this.cargando = false;
        alert('Hubo un error al conectar con el servidor.');
      }
    });
  }

  // Acción al hacer clic en una mesa
  // Acción al hacer clic en una mesa
  seleccionarMesa(mesa: Mesa): void {
    if (mesa.estado === 'OCUPADA' || mesa.estado === 'POR_PAGAR') {
      console.log(`Abriendo detalle de la mesa ${mesa.numeroMesa} ya ocupada...`);
      // Más adelante puedes redirigir a una vista de "Detalle/Cobro"
    } else if (mesa.estado === 'LIBRE') {
      console.log(`Iniciando nueva atención en la mesa ${mesa.numeroMesa}...`);
      
      // 🚀 REDIRIGIR AL NUEVO COMPONENTE PASANDO EL ID DE LA MESA
      this.router.navigate(['/pedido', mesa.idMesa]); 
      
    } else {
      alert(`La mesa ${mesa.numeroMesa} está en mantenimiento.`);
    }
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}