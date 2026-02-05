import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido.interface';
import { PedidoService } from '../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EstadoPedido } from '../../enums/estado-pedido.enum';
import { EstadoUsuario } from '../../enums/estado-usuario.enum';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css'
})
export class PedidoComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidoSeleccionado?: Pedido;
  mostrarModalCrear = false;
  mostrarModalEditar = false;

  nuevoPedido: Partial<Pedido> = {};
  pedidoEditado: Partial<Pedido> = {};

  // 👇 Hacemos visible el enum para usarlo en el HTML
  EstadoPedido = EstadoPedido;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.pedidoService.listar().subscribe({
      next: data => (this.pedidos = data),
      error: err => console.error('Error al obtener pedidos', err)
    });
  }

  abrirModalCrear() {
    this.nuevoPedido = {};
    this.mostrarModalCrear = true;
  }

  crearPedido() {
    this.pedidoService.crear(this.nuevoPedido as Pedido).subscribe({
      next: () => {
        this.mostrarModalCrear = false;
        this.obtenerPedidos();
        Swal.fire('Creado', 'El pedido ha sido creado correctamente', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo crear el pedido', 'error')
    });
  }

  abrirModalEditar(pedido: Pedido) {
    this.pedidoEditado = { ...pedido };
    this.mostrarModalEditar = true;
  }

  guardarCambios() {
    this.pedidoService.actualizar(this.pedidoEditado.id!, this.pedidoEditado as Pedido).subscribe({
      next: () => {
        this.mostrarModalEditar = false;
        this.obtenerPedidos();
        Swal.fire('Actualizado', 'El pedido ha sido actualizado', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el pedido', 'error')
    });
  }

  eliminarPedido(pedido: Pedido) {
    Swal.fire({
      title: '¿Eliminar pedido?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.pedidoService.eliminar(pedido.id).subscribe({
          next: () => {
            this.obtenerPedidos();
            Swal.fire('Eliminado', 'El pedido fue eliminado', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el pedido', 'error')
        });
      }
    });
  }

  cerrarModales() {
    this.mostrarModalCrear = false;
    this.mostrarModalEditar = false;
  }
}