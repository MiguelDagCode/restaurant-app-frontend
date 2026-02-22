export interface Mesa {
  idMesa?: number; // Opcional porque no se envía al crear
  numeroMesa: string;
  capacidad: number;
  estado?: 'LIBRE' | 'OCUPADA' | 'POR_PAGAR' | 'MANTENIMIENTO'; 
}