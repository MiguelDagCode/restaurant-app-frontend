export interface DetallePedidoRequest {
  idProducto: number;
  cantidad: number;
  observaciones?: string;
}