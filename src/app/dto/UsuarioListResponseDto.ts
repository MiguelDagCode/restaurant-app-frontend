export interface UsuarioListResponseDto {
  idUsuario: number;
  nombresCompletos: string; // Asumiendo que tu DTO de lista devuelve esto
  correo: string;
  telefono: string;
  nombreRol: string;
  estado: boolean;
}