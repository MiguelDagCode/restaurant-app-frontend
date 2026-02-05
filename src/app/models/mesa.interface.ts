import { EstadoMesa } from "../enums/estado-mesa.enum";
import { Pedido } from "./pedido.interface";

export interface Mesa {
  id: number;
  numero: number;
  estado: EstadoMesa;
  pedidos: Pedido[]; // Relación con pedidos
}