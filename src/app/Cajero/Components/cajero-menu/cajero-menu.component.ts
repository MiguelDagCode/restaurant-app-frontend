import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';
import Swal from 'sweetalert2';
import { PedidoResponse } from '../../../models/PedidoResponse';
import { PedidoService } from '../../../services/pedido.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-cajero-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cajero-menu.html',
  styleUrl: './cajero-menu.css'
})
export class CajeroMenuComponent implements OnInit {

  fechaActual: string = '';
  
  pedidosOriginales: PedidoResponse[] = [];
  pedidosAMostrar: PedidoResponse[] = []; 
  
  cargando: boolean = true;

  constructor(
    private router: Router, 
    private tokenService: TokenService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    this.fechaActual = new Date().toLocaleDateString('es-ES', opciones);
    this.cargarPedidosDelBackend();
  }

  cargarPedidosDelBackend(): void {
    this.pedidoService.listarPedidos().subscribe({
      next: (data) => {
        this.pedidosOriginales = data.reverse(); 
        this.filtrarPedidos('por_cobrar');
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al traer pedidos', err);
        this.cargando = false;
        Swal.fire('Error', 'No se pudieron cargar los pedidos del servidor.', 'error');
      }
    });
  }

  onFiltroChange(event: any): void {
    const valor = event.target.value;
    this.filtrarPedidos(valor);
  }

  filtrarPedidos(filtro: string): void {
    if (filtro === 'todos') {
      this.pedidosAMostrar = [...this.pedidosOriginales];
    } else if (filtro === 'por_cobrar') {
      this.pedidosAMostrar = this.pedidosOriginales.filter(p => 
        p.estadoPedido === 'PENDIENTE' || p.estadoPedido === 'ENTREGADO' || p.estadoPedido === 'EN_PREPARACION'
      );
    } else if (filtro === 'pagado') {
      this.pedidosAMostrar = this.pedidosOriginales.filter(p => p.estadoPedido === 'PAGADO');
    }
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  verComprobante(pedido: PedidoResponse): void {
    // Cuando ya está pagado, generamos el PDF directo
    this.generarBoletaPDF(pedido);
  }

  cobrarPedido(pedido: PedidoResponse): void {
    Swal.fire({
      title: `¿Cobrar S/ ${pedido.total.toFixed(2)}?`,
      text: `Mesa ${pedido.numeroMesa} - Cliente: ${pedido.nombresCliente}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FF6B35',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-check-circle me-1"></i> Sí, registrar pago',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          title: 'Procesando pago...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        this.pedidoService.cobrarPedido(pedido.idPedido).subscribe({
          next: (pedidoActualizado) => {
            Swal.close();
            // ¡Cobro exitoso! Recargamos la tabla y automáticamente generamos su boleta PDF
            this.cargarPedidosDelBackend(); 
            this.generarBoletaPDF(pedidoActualizado);
          },
          error: (err) => {
            console.error('Error al cobrar:', err);
            Swal.fire('Error', err.error?.mensaje || 'Hubo un problema al procesar el pago.', 'error');
          }
        });
      }
    });
  }

  // --- MAGIA: GENERACIÓN DE PDF PROFESIONAL ---
 // --- MAGIA: GENERACIÓN DE PDF PROFESIONAL ---
  generarBoletaPDF(pedido: PedidoResponse): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    // Encapsulamos el diseño en una función para poder llamarla con o sin logo
    const dibujarDocumento = (tieneLogo: boolean) => {
      
      if (tieneLogo) {
        doc.addImage(logo, 'PNG', 14, 10, 25, 25);
      }

      // 2. Cabecera del Documento
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('DELIFAST', 45, 18);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('RUC: 20512345678', 45, 24);
      doc.text('Av. Principal 123, Carabayllo, Lima', 45, 29);
      doc.text('Teléfono: (01) 555-1234', 45, 34);

      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(14, 40, 134, 40);

      // 3. Datos del Comprobante
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('BOLETA DE VENTA ELECTRÓNICA', 74, 48, { align: 'center' });
      
      doc.setFontSize(11);
      doc.text(`Ticket N°: B001-${String(pedido.idPedido).padStart(6, '0')}`, 74, 54, { align: 'center' });

      // 4. Datos del Cliente
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 65);
      doc.text(`Cliente: ${pedido.nombresCliente}`, 14, 71);
      doc.text(`${pedido.tipoDoc}: ${pedido.numDoc || 'N/A'}`, 14, 77);
      doc.text(`Mesa: ${pedido.numeroMesa}`, 100, 77);

      // 5. Tabla de Productos usando autoTable
      const tableBody = pedido.detalles.map(d => [
        d.cantidad.toString(),
        d.nombreProducto,
        `S/ ${d.precioUnitario.toFixed(2)}`,
        `S/ ${d.subtotal.toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 85,
        head: [['Cant.', 'Descripción', 'P. Unitario', 'Subtotal']],
        body: tableBody,
        theme: 'striped',
        headStyles: { 
          fillColor: [255, 107, 53], // Color naranja
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 }, 
          1: { halign: 'left', cellWidth: 'auto' }, 
          2: { halign: 'right', cellWidth: 25 }, 
          3: { halign: 'right', cellWidth: 25 }  
        },
        styles: { fontSize: 9 }
      });

      // 6. Totales
      const finalY = (doc as any).lastAutoTable.finalY || 85;
      
      const subtotalBase = pedido.total / 1.18;
      const igv = pedido.total - subtotalBase;

      doc.setFontSize(10);
      doc.text(`Op. Gravada:`, 85, finalY + 10);
      doc.text(`S/ ${subtotalBase.toFixed(2)}`, 134, finalY + 10, { align: 'right' });
      
      doc.text(`IGV (18%):`, 85, finalY + 16);
      doc.text(`S/ ${igv.toFixed(2)}`, 134, finalY + 16, { align: 'right' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL A PAGAR:`, 80, finalY + 24);
      doc.text(`S/ ${pedido.total.toFixed(2)}`, 134, finalY + 24, { align: 'right' });

      // 7. Pie de página
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`Atendido por: ${pedido.nombreMozo}`, 74, finalY + 35, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.text('¡Gracias por su preferencia!', 74, finalY + 41, { align: 'center' });

      // 8. Abrir el PDF
      window.open(doc.output('bloburl'), '_blank');
    };

    // INTENTAMOS CARGAR LA IMAGEN
    const logo = new Image();
    // NOTA: Quitamos el '/' inicial. A veces Angular prefiere rutas relativas estrictas.
    logo.src = 'assets/logo.png'; 

    logo.onload = () => {
      // Si la imagen carga perfecto, dibujamos CON logo
      dibujarDocumento(true);
    };

    logo.onerror = () => {
      console.warn('⚠️ No se pudo cargar el logo de assets. Generando comprobante sin logo para no bloquear el sistema.');
      // Si falla la imagen, dibujamos SIN logo al instante
      dibujarDocumento(false);
    };
  }
}