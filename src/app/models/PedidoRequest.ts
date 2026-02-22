import { DetallePedidoRequest } from "./DetallePedidoRequest";

export interface PedidoRequest {
  idMesa: number;
  nombresCliente: string;
  tipoDoc: string; 
  numDoc?: string;
  telefonoCliente?: string;
  detalles: DetallePedidoRequest[];
}