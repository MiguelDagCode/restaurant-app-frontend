import { DetallePedidoRequest } from "./detalle-pedido.dto";

export interface PedidoTransferencia {
  id: number;
  mozo: any; // Puedes definir una interfaz específica si lo deseas
  mesa: any;
  fecha: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'LISTO' | 'PAGADO';
  detalles: DetallePedidoRequest[];
}