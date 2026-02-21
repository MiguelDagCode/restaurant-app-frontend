import { Component } from '@angular/core';
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
export class AdminMenuComponent {
adminEmail: string = 'admin@delifast.com'; // Podrías sacarlo del token
  currentDate: Date = new Date();

  // Datos para las tarjetas de estadísticas (Stats Cards)
  stats = [
    { title: 'Pedidos Hoy', value: '127', icon: 'bi-box-seam', trend: '+12%', trendUp: true },
    { title: 'Clientes Activos', value: '2,845', icon: 'bi-people', trend: '+5.3%', trendUp: true },
    { title: 'Ingresos del Día', value: '$4,320', icon: 'bi-graph-up-arrow', trend: '+8.1%', trendUp: true },
    { title: 'Tiempo Promedio', value: '24 min', icon: 'bi-clock-history', trend: '-3 min', trendUp: true } // trendUp true porque bajar el tiempo es bueno
  ];

  // Datos para Alertas de Stock
  stockAlerts = [
    { product: 'Lechuga', current: 2, min: 10, status: 'Crítico' },
    { product: 'Pan Hamburguesa', current: 8, min: 15, status: 'Bajo' },
    { product: 'Queso Mozzarella', current: 3, min: 10, status: 'Crítico' },
  ];

  // Datos para Órdenes de Compra
  recentOrders = [
    { id: 'OC-001', supplier: 'Distribuidora Central', items: 5, total: 1250, status: 'Aprobado' },
    { id: 'OC-002', supplier: 'Carnes Premium', items: 3, total: 890, status: 'Sugerido' },
    { id: 'OC-003', supplier: 'Verduras Frescas', items: 8, total: 420, status: 'Enviado' },
  ];

  constructor(private tokenService: TokenService, private router: Router) {}

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}