import { EstadoDetalle } from "../enums/estado-detalle.enum";
import { Pedido } from "./pedido.interface";
import { Plato } from "./plato.interface";


export interface DetallePedido {
  id: number;
  plato: Plato;
  cantidad: number;
  estado: EstadoDetalle;
}
