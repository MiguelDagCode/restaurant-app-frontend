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
    // Implementar modal con detalle completo si se desea
    Swal.fire({
      title: `Detalles Mesa ${pedido.numeroMesa}`,
      text: 'Aquí se mostrarían datos extra si los hubiera',
      icon: 'info',
      confirmButtonColor: '#FF6B35'
    });
  }
}