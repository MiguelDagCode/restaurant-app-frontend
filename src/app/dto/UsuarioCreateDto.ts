export interface UsuarioCreateDto {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  idRol: number;
  password?: string; // Opcional en el front, pero enviaremos algo por defecto si está vacío
}