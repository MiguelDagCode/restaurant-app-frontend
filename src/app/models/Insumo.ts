export interface Insumo {
  idInsumo?: number; // Es opcional porque al crear uno nuevo no tenemos ID
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
}