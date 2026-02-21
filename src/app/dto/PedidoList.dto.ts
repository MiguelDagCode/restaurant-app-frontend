import { ItemPedido } from "./ItemPedido.dto";

export interface PedidoListDto {
  id: string;
  mesa: number;
  cliente: string;
  hora: string;
  estado: 'Pendiente' | 'En Preparacion' | 'Listo';
  tiempoEspera: number; // en minutos
  items: ItemPedido[];
}