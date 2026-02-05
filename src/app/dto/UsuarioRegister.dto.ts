import { EstadoUsuario } from "../enums/estado-usuario.enum";
import { RolUsuario } from "../models/rol-usuario.interface";

export interface UsuarioRegister {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  dni?: string;
  estado: EstadoUsuario;
  fechaRegistro: string; 
  rol: RolUsuario;
  direccion?: string;
}