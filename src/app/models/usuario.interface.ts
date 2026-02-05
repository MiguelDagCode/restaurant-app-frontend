import { EstadoUsuario } from "../enums/estado-usuario.enum";
import { RolUsuario } from "./rol-usuario.interface";

export interface Usuario {
  idUsuario: number;
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