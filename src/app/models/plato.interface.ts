import { CategoriaPlato } from "./categoria-plato.interface";

export interface Plato {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaPlato;
  urlImagen: string;
}