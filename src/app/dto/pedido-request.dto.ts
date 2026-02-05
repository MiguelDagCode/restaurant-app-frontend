import { DetallePedidoRequest } from "./detalle-pedido.dto";

export interface PedidoRequest {
  mozoId: number;
  mesaId: number;
  detalles: DetallePedidoRequest[];
}