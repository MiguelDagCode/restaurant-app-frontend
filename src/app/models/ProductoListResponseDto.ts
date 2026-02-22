export interface ProductoListResponseDto {
  idProducto: number;
  nombre: string;
  precio: number;
  imgUrl: string;
  estado: boolean;
  idCategoria: number;
  categoriaNombre: string;
}