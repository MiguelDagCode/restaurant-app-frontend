import { ProductoListResponseDto } from "./ProductoListResponseDto";

export interface CategoriaConProductosDto {
  idCategoria: number;
  nombre: string;
  productos: ProductoListResponseDto[];
}