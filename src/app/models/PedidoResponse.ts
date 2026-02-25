import { DetallePedidoResponse } from "./DetallePedidoResponse";

export interface PedidoResponse {
  idPedido: number;
  idMesa: number;
  numeroMesa: string;
  nombreMozo: string;
  nombresCliente: string;
  tipoDoc: string;
  numDoc: string;
  telefonoCliente: string;
  estadoPedido: string;
  fechaApertura: string;
  total: number;
  detalles: DetallePedidoResponse[];
}