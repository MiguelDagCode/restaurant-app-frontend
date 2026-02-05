import { EstadoPedido } from "../enums/estado-pedido.enum";
import { DetallePedido } from "./detalle-pedido.interface";
import { Mesa } from "./mesa.interface";
import { Pago } from "./pago.interface";
import { Usuario } from "./usuario.interface";

export interface Pedido {
  id: number;
  mozo: Usuario;
  mesa?: Mesa; // puede ser undefined si no se incluye en la respuesta
  fecha: string; 
  estado: EstadoPedido;
  detalles: DetallePedido[]; // ← debe ser un array
  pago?: Pago; // puede ser undefined si no está pagado
}