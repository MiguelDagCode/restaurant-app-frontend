import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../../auth/services/token.service';


export interface PedidoCaja {
  nroPedido: string;
  mesa: number;
  cliente: string;
  documentoTipo: 'DNI' | 'RUC';
  documentoNumero: string;
  fechaApertura: string;
  horaApertura: string;
  tiempoTranscurrido: string;
  total: number;
  estado: 'Entregado' | 'Pagado';
}

@Component({
  selector: 'app-cajero-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cajero-menu.html',
  styleUrl: './cajero-menu.css'
})
export class CajeroMenuComponent implements OnInit {

  fechaActual: string = '';

  // Indicadores KPI
  kpiPorCobrar: number = 2;
  kpiCobradosHoy: number = 2;
  kpiTotalRecaudado: number = 229.80;

  // Datos de la tabla idénticos a la imagen
  pedidos: PedidoCaja[] = [
    {
      nroPedido: 'PED-2601', mesa: 2, cliente: 'Ana García', documentoTipo: 'DNI', documentoNumero: '72341823',
      fechaApertura: '20/02/2026', horaApertura: '12:26 p. m.', tiempoTranscurrido: '55min',
      total: 83.00, estado: 'Entregado'
    },
    {
      nroPedido: 'PED-2602', mesa: 5, cliente: 'Restaurantes SAC', documentoTipo: 'RUC', documentoNumero: '20512345678',
      fechaApertura: '20/02/2026', horaApertura: '12:41 p. m.', tiempoTranscurrido: '40min',
      total: 162.00, estado: 'Pagado'
    },
    {
      nroPedido: 'PED-2603', mesa: 8, cliente: 'Pedro Ríos', documentoTipo: 'DNI', documentoNumero: '45123789',
      fechaApertura: '20/02/2026', horaApertura: '12:06 p. m.', tiempoTranscurrido: '75min',
      total: 44.00, estado: 'Entregado'
    },
    {
      nroPedido: 'PED-2600', mesa: 1, cliente: 'María Torres', documentoTipo: 'DNI', documentoNumero: '61234890',
      fechaApertura: '20/02/2026', horaApertura: '11:41 p. m.', tiempoTranscurrido: '100min',
      total: 67.80, estado: 'Pagado'
    }
  ];

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit(): void {
    // Configurar fecha actual (puedes usar DatePipe o formatear manualmente)
    const opciones: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    this.fechaActual = new Date().toLocaleDateString('es-ES', opciones);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  cobrarPedido(pedido: PedidoCaja): void {
    console.log(`Procesando cobro para el pedido ${pedido.nroPedido}`);
    // Lógica para abrir modal de pago o ir a otra vista
  }

  verComprobante(pedido: PedidoCaja): void {
    console.log(`Mostrando comprobante del pedido ${pedido.nroPedido}`);
    // Lógica para descargar o mostrar PDF (Punto 5 de tu arquitectura)
  }
}