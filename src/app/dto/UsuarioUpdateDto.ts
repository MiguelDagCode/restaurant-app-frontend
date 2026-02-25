export interface UsuarioUpdateDto {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  idRol: number;
  password?: string;
}