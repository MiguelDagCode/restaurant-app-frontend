import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoListResponseDto } from '../../../models/ProductoListResponseDto';
import { CategoriaConProductosDto } from '../../../models/CategoriaConProductosDto';
import { TokenService } from '../../../auth/services/token.service';
import { PedidoRequest } from '../../../models/PedidoRequest';
import Swal from 'sweetalert2';
import { PedidoService } from '../../../services/pedido.service';
import { ProductoService } from '../../../services/producto.service';

// Interfaz para el carrito
export interface DetalleCarrito {
  producto: ProductoListResponseDto;
  cantidad: number;
}

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.html',
  styleUrls: ['./pedido.css']
})
export class PedidoComponent implements OnInit {
  idMesaSeleccionada: number = 0;
  
  catalogo: CategoriaConProductosDto[] = [];
  categoriaActiva: CategoriaConProductosDto | null = null;
  carrito: DetalleCarrito[] = [];

  constructor(
    private route: ActivatedRoute, // Para leer la URL
    private router: Router,        // Para navegar
    private tokenService: TokenService,
    private productoService: ProductoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    // Capturamos el ID de la mesa desde la URL
    this.idMesaSeleccionada = Number(this.route.snapshot.paramMap.get('idMesa'));
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.productoService.obtenerCatologoAgrupado().subscribe({
      next: (data) => {
        this.catalogo = data;
        if (data.length > 0) this.categoriaActiva = data[0]; 
      },
      error: (err) => console.error('Error al cargar catálogo', err)
    });
  }

  volverAlMapa(): void {
    this.router.navigate(['mozo-menu']);
  }

  // --- LÓGICA DEL CARRITO ---
  seleccionarCategoria(cat: CategoriaConProductosDto): void {
    this.categoriaActiva = cat;
  }

  agregarAlCarrito(producto: ProductoListResponseDto): void {
    const item = this.carrito.find(i => i.producto.idProducto === producto.idProducto);
    if (item) {
      item.cantidad++;
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }
  }

  quitarDelCarrito(index: number): void {
    this.carrito.splice(index, 1);
  }

  get totalPedido(): number {
    return this.carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

    logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
  abrirFormularioCliente(): void {
  Swal.fire({
    title: 'Datos del Cliente',
    html: `
      <div class="text-start mt-3">
        <div class="row g-2 mb-3">
          <div class="col-4">
            <label class="form-label fw-bold small text-muted">Tipo Doc.</label>
            <select id="swal-tipoDoc" class="form-select shadow-sm">
              <option value="DNI" selected>DNI</option>
              <option value="RUC">RUC</option>
              <option value="PASAPORTE">PASAP.</option>
            </select>
          </div>
          <div class="col-8">
            <label class="form-label fw-bold small text-muted">Número</label>
            <input id="swal-numDoc" type="text" class="form-control shadow-sm" placeholder="Ej: 72145698">
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label fw-bold small text-muted">Nombre o Razón Social *</label>
          <input id="swal-nombre" type="text" class="form-control shadow-sm" placeholder="Ej: Juan Perez">
        </div>
        
        <div class="mb-2">
          <label class="form-label fw-bold small text-muted">Teléfono (Opcional)</label>
          <input id="swal-telefono" type="text" class="form-control shadow-sm" placeholder="Ej: 999 888 777">
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: '<i class="bi bi-send-fill me-1"></i> Confirmar Pedido',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#FF6B35',
    cancelButtonColor: '#6c757d',
    focusConfirm: false,
    preConfirm: () => {
      const tipoDoc = (document.getElementById('swal-tipoDoc') as HTMLSelectElement).value;
      const numDoc = (document.getElementById('swal-numDoc') as HTMLInputElement).value;
      const nombresCliente = (document.getElementById('swal-nombre') as HTMLInputElement).value;
      const telefonoCliente = (document.getElementById('swal-telefono') as HTMLInputElement).value;

      if (!nombresCliente || nombresCliente.trim() === '') {
        Swal.showValidationMessage('El nombre del cliente es obligatorio');
        return false;
      }

      return { tipoDoc, numDoc, nombresCliente, telefonoCliente };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;

      const pedidoRequest: PedidoRequest = {
        idMesa: this.idMesaSeleccionada,
        nombresCliente: data.nombresCliente,
        tipoDoc: data.tipoDoc,
        numDoc: data.numDoc,
        telefonoCliente: data.telefonoCliente,
        detalles: this.carrito.map(item => ({
          idProducto: item.producto.idProducto,
          cantidad: item.cantidad,
          observaciones: ''
        }))
      };

      Swal.fire({
        title: 'Procesando...',
        text: 'Enviando orden a la cocina y descontando stock',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      this.pedidoService.registrarPedido(pedidoRequest).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Pedido Registrado!',
            text: 'La orden ha sido enviada a cocina exitosamente.',
            confirmButtonColor: '#FF6B35'
          }).then(() => this.volverAlMapa());
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error en la orden',
            text: err.error?.mensaje || 'Hubo un problema al registrar el pedido.',
            confirmButtonColor: '#FF6B35'
          });
        }
      });
    }
  });
}

enviarACocina(): void {
    if (this.carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito Vacío',
        text: 'Agrega productos al pedido antes de enviarlo a la cocina.',
        confirmButtonColor: '#FF6B35'
      });
      return;
    }
    this.abrirFormularioCliente();
 
    }


}