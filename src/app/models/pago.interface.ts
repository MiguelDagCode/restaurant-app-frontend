import { TipoDocumento } from "../enums/tipo-documento.enum";
import { Pedido } from "./pedido.interface";

export interface Pago {
  id: number;
  pedido: Pedido;
  nombreCliente: string;
  dniRuc: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  fecha: string;
  montoTotal: number;
}