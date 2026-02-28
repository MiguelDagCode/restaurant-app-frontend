import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';
import { CocinaService } from '../../../services/cocina.service';
import Swal from 'sweetalert2';
import { PedidoResponse } from '../../../models/PedidoResponse';

@Component({
  selector: 'app-cocina-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina-menu.html',
  styleUrls: ['./cocina-menu.css']
})
export class CocinaMenuComponent implements OnInit, OnDestroy {

  pendientes: PedidoResponse[] = [];
  enPreparacion: PedidoResponse[] = [];
  listos: PedidoResponse[] = []; // Corresponde al estado 'ENTREGADO' (Listo para servir)
  
  intervaloRecarga: any;
  horaActual: Date = new Date(); // Para recalcular los minutos transcurridos

  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private cocinaService: CocinaService
  ) {}

  ngOnInit(): void {
    this.cargarTablero();
    
    // Auto-recarga cada 10 segundos
    this.intervaloRecarga = setInterval(() => {
      this.cargarTablero();
      this.horaActual = new Date(); // Actualizamos la hora para los cronómetros
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.intervaloRecarga) clearInterval(this.intervaloRecarga);
  }

  cargarTablero(): void {
    this.cocinaService.listarPedidosCocina().subscribe({
      next: (data) => {
        // Distribuimos los pedidos en las 3 columnas
        this.pendientes = data.filter(p => p.estadoPedido === 'PENDIENTE');
        this.enPreparacion = data.filter(p => p.estadoPedido === 'EN_PREPARACION');
        this.listos = data.filter(p => p.estadoPedido === 'ENTREGADO'); 
      },
      error: (err) => {
        console.error('Error al cargar KDS', err);
        // Desactivamos la alerta en el bucle para no ser molestos
        if(!this.intervaloRecarga) Swal.fire('Error', 'No se pudo conectar a Cocina.', 'error');
      }
    });
  }

  // --- ACCIONES DE ESTADO ---

  iniciarPreparacion(pedido: PedidoResponse): void {
    // Alarma visual opcional de SweetAlert (se comenta si se quiere instantáneo)
    this.cocinaService.iniciarPreparacion(pedido.idPedido).subscribe({
      next: () => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Preparando...', showConfirmButton: false, timer: 1000 });
        this.cargarTablero();
      },
      error: () => Swal.fire('Error', 'No se pudo iniciar.', 'error')
    });
  }

  finalizarPreparacion(pedido: PedidoResponse): void {
    this.cocinaService.finalizarPreparacion(pedido.idPedido).subscribe({
      next: () => {
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '¡Listo para servir!', showConfirmButton: false, timer: 1500 });
        this.cargarTablero();
      },
      error: () => Swal.fire('Error', 'No se pudo finalizar.', 'error')
    });
  }

  // --- HELPERS PARA LA VISTA ---

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  // Calcula los minutos transcurridos desde que se hizo el pedido
  calcularMinutosTranscurridos(fechaString: string): number {
    if (!fechaString) return 0;
    const fechaApertura = new Date(fechaString);
    const difMilisegundos = this.horaActual.getTime() - fechaApertura.getTime();
    return Math.floor(difMilisegundos / 60000); // Convertir a minutos
  }

  // Devuelve una clase CSS de Bootstrap dependiendo de si el pedido se está demorando mucho
  getColorTiempo(minutos: number): string {
    if (minutos < 15) return 'bg-success text-white border-success';
    if (minutos < 30) return 'bg-warning text-dark border-warning';
    return 'bg-danger text-white border-danger'; // ¡Más de 30 minutos, alerta roja!
  }

  // Acción para el botón de Detalle
  verDetalle(pedido: PedidoResponse): void {
    // 1. Construimos las filas de los productos iterando sobre el arreglo
    let htmlProductos = '';
    
    pedido.detalles.forEach(item => {
      // Si hay nota, la mostramos en rojo y cursiva para que el cocinero no la pase por alto
      const notaHtml = item.observaciones 
        ? `<div class="text-danger small fst-italic mt-1"><i class="bi bi-exclamation-triangle-fill me-1"></i>${item.observaciones}</div>` 
        : '';

      htmlProductos += `
        <tr>
          <td class="text-center align-middle fw-bold fs-5">${item.cantidad}</td>
          <td class="text-start align-middle">
            <span class="fw-medium">${item.nombreProducto}</span>
            ${notaHtml}
          </td>
        </tr>
      `;
    });

    // 2. Armamos la estructura final del modal
    const htmlModal = `
      <div class="text-start mb-3 pb-2 border-bottom">
        <p class="mb-1 text-muted"><i class="bi bi-person-badge me-2"></i>Mozo: <span class="text-dark fw-medium">${pedido.nombreMozo}</span></p>
        <p class="mb-1 text-muted"><i class="bi bi-clock me-2"></i>Hora de orden: <span class="text-dark fw-medium">${new Date(pedido.fechaApertura).toLocaleTimeString()}</span></p>
      </div>
      
      <table class="table table-sm table-hover mb-0">
        <thead class="table-light text-muted">
          <tr>
            <th class="text-center" style="width: 20%;">Cant.</th>
            <th class="text-start">Descripción del Plato</th>
          </tr>
        </thead>
        <tbody>
          ${htmlProductos}
        </tbody>
      </table>
    `;

    // 3. Lanzamos la alerta
    Swal.fire({
      title: `Orden PED-${String(pedido.idPedido).padStart(3, '0')} <br><span class="text-orange fs-4">Mesa ${pedido.numeroMesa}</span>`,
      html: htmlModal,
      icon: 'info',
      width: '500px',
      confirmButtonColor: '#FF6B35',
      confirmButtonText: '<i class="bi bi-check-lg me-1"></i> Entendido',
      showCloseButton: true,
      customClass: {
        title: 'fs-3 fw-bold text-dark'
      }
    });
  }
}