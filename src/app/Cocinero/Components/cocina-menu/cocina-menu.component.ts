import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoListDto } from '../../../dto/PedidoList.dto';

@Component({
  selector: 'app-cocina-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina-menu.html',
  styleUrl: './cocina-menu.css'
})
export class CocinaMenuComponent implements OnInit {

  // Datos de prueba basados en tu diseño
  pedidos: PedidoListDto[] = [
    {
      id: 'PED-008', mesa: 4, cliente: 'Fernando Torres', hora: '11:42 a. m.', estado: 'Pendiente', tiempoEspera: 1,
      items: [
        { cantidad: 1, nombre: 'Arroz con Mariscos', nota: 'Sin picante' },
        { cantidad: 2, nombre: 'Chicha Morada' }
      ]
    },
    {
      id: 'PED-009', mesa: 8, cliente: 'Valentina Cruz', hora: '11:41 a. m.', estado: 'Pendiente', tiempoEspera: 2,
      items: [
        { cantidad: 2, nombre: 'Ají de Gallina', nota: 'Extra arroz' },
        { cantidad: 1, nombre: 'Causa Limeña' }
      ]
    },
    {
      id: 'PED-001', mesa: 3, cliente: 'Carlos M.', hora: '11:38 a. m.', estado: 'En Preparacion', tiempoEspera: 5,
      items: [
        { cantidad: 2, nombre: 'Hamburguesa Clásica', nota: 'Sin cebolla, término medio' },
        { cantidad: 1, nombre: 'Papas Fritas XL' },
        { cantidad: 2, nombre: 'Limonada Natural', nota: 'Poca azúcar' }
      ]
    },
    {
      id: 'PED-002', mesa: 7, cliente: 'Ana López', hora: '11:29 a. m.', estado: 'En Preparacion', tiempoEspera: 14,
      items: [
        { cantidad: 1, nombre: 'Pizza Margherita', nota: 'Extra queso' },
        { cantidad: 1, nombre: 'Ensalada César', nota: 'Sin anchoas' }
      ]
    },
    {
      id: 'PED-005', mesa: 9, cliente: 'Jorge Díaz', hora: '11:40 a. m.', estado: 'Listo', tiempoEspera: 3,
      items: [
        { cantidad: 2, nombre: 'Sopa del Día', nota: 'Sin picante' }
      ]
    }
  ];

  // Listas filtradas para el HTML
  pendientes: PedidoListDto[] = [];
  enPreparacion: PedidoListDto[] = [];
  listos: PedidoListDto[] = [];

  ngOnInit(): void {
    this.actualizarTableros();
  }

  // Lógica para filtrar los pedidos en sus respectivas columnas
  actualizarTableros(): void {
    this.pendientes = this.pedidos.filter(p => p.estado === 'Pendiente');
    this.enPreparacion = this.pedidos.filter(p => p.estado === 'En Preparacion');
    this.listos = this.pedidos.filter(p => p.estado === 'Listo');
  }

  // Métodos de acción para los botones
  cambiarEstado(pedido: PedidoListDto, nuevoEstado: 'Pendiente' | 'En Preparacion' | 'Listo'): void {
    pedido.estado = nuevoEstado;
    this.actualizarTableros();
  }

  // Método auxiliar para el color del tiempo de espera
  getColorTiempo(minutos: number): string {
    if (minutos >= 10) return 'text-danger bg-danger-light border-danger';
    if (minutos >= 5) return 'text-warning bg-warning-light border-warning';
    return 'text-success bg-success-light border-success';
  }
}
