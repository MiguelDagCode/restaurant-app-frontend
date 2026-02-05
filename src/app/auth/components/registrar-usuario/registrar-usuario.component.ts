import { Component } from '@angular/core';
import { Usuario } from '../../../models/usuario.interface';
import { EstadoUsuario } from '../../../enums/estado-usuario.enum';
import { RegisterService } from '../../services/register.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioRegister } from '../../../dto/UsuarioRegister.dto';


@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrar-usuario.html',
  styleUrl: './registrar-usuario.css'
})
export class RegistrarUsuarioComponent {
    usuario: UsuarioRegister = {
    nombres: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    telefono: '',
    dni: '',
    estado: EstadoUsuario.ACTIVO,
    fechaRegistro: new Date().toISOString(),
    rol: { id: 1, nombre: 'ADMIN' },
    direccion: ''
  };

  constructor(private registerService: RegisterService,   private router: Router) {}

crearUsuario() {
  this.registerService.crearUsuario(this.usuario).subscribe({
    next: () => this.router.navigate(['/login']),
    error: (err) => console.error('Error al crear usuario:', err)
  });
}

cancelar(): void {
  this.router.navigate(['/login']);
}
}