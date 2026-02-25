import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioListResponseDto } from '../../../dto/UsuarioListResponseDto';
import { Rol } from '../../../models/Rol';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { UsuarioResponseDto } from '../../../dto/UsuarioResponseDto';
import { UsuarioUpdateDto } from '../../../dto/UsuarioUpdateDto';
import { UsuarioCreateDto } from '../../../dto/UsuarioCreateDto';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {

  usuariosOriginales: UsuarioListResponseDto[] = [];
  usuariosFiltrados: UsuarioListResponseDto[] = [];
  terminoBusqueda: string = '';
  
  rolesDisponibles: Rol[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarRoles(); // Primero cargamos los roles
    this.cargarUsuarios(); // Luego los usuarios
  }

  cargarRoles(): void {
    this.rolService.listarTodos().subscribe({
      next: (data) => this.rolesDisponibles = data.filter(r => r.activo), // Solo roles activos
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuariosOriginales = data;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  aplicarFiltro(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.usuariosFiltrados = this.usuariosOriginales;
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.usuariosFiltrados = this.usuariosOriginales.filter(u => 
        u.nombresCompletos.toLowerCase().includes(termino) || 
        u.correo.toLowerCase().includes(termino)
      );
    }
  }

  // --- MODAL CREAR / EDITAR ---
  abrirModalUsuario(idUsuarioEditar?: number): void {
    const esEdicion = !!idUsuarioEditar;

    if (esEdicion) {
      // Si es edición, primero traemos el detalle del usuario (para tener su idRol)
      Swal.fire({ title: 'Cargando datos...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
      
      this.usuarioService.obtenerPorId(idUsuarioEditar).subscribe({
        next: (usuarioDetalle) => {
          Swal.close();
          this.mostrarFormularioSwal(esEdicion, usuarioDetalle);
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudieron cargar los datos del usuario', 'error');
        }
      });
    } else {
      // Si es nuevo, abrimos el form vacío
      this.mostrarFormularioSwal(false);
    }
  }

  private mostrarFormularioSwal(esEdicion: boolean, usuarioExistente?: UsuarioResponseDto): void {
    
    // 1. Construimos los <option> del <select> de roles
    let opcionesRolesHTML = '<option value="" disabled selected>Seleccione un rol...</option>';
    this.rolesDisponibles.forEach(rol => {
      const isSelected = esEdicion && usuarioExistente?.idRol === rol.idRol ? 'selected' : '';
      opcionesRolesHTML += `<option value="${rol.idRol}" ${isSelected}>${rol.nombreRol}</option>`;
    });

    // 2. Construimos el HTML del formulario
    const htmlFormulario = `
      <div class="text-start mt-3">
        <div class="row">
          <div class="col-6 mb-3">
            <label class="form-label fw-bold small text-muted">Nombre</label>
            <input id="swal-nombre" class="form-control" value="${esEdicion ? usuarioExistente!.nombre : ''}">
          </div>
          <div class="col-6 mb-3">
            <label class="form-label fw-bold small text-muted">Apellido</label>
            <input id="swal-apellido" class="form-control" value="${esEdicion ? usuarioExistente!.apellido : ''}">
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold small text-muted">Correo Electrónico</label>
          <input id="swal-correo" type="email" class="form-control" value="${esEdicion ? usuarioExistente!.correo : ''}">
        </div>

        <div class="row">
          <div class="col-6 mb-3">
            <label class="form-label fw-bold small text-muted">Teléfono</label>
            <input id="swal-telefono" class="form-control" value="${esEdicion ? (usuarioExistente!.telefono || '') : ''}">
          </div>
          <div class="col-6 mb-3">
            <label class="form-label fw-bold small text-muted">Rol de Acceso</label>
            <select id="swal-rol" class="form-select">
              ${opcionesRolesHTML}
            </select>
          </div>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold small text-muted">${esEdicion ? 'Nueva Contraseña (Dejar vacío para mantener actual)' : 'Contraseña *'}</label>
          <input id="swal-password" type="password" class="form-control" placeholder="***">
        </div>
      </div>
    `;

    // 3. Lanzamos el SweetAlert
    Swal.fire({
      title: esEdicion ? 'Editar Usuario' : 'Nuevo Usuario',
      html: htmlFormulario,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FF6B35',
      width: '600px',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
        const apellido = (document.getElementById('swal-apellido') as HTMLInputElement).value.trim();
        const correo = (document.getElementById('swal-correo') as HTMLInputElement).value.trim();
        const telefono = (document.getElementById('swal-telefono') as HTMLInputElement).value.trim();
        const idRol = parseInt((document.getElementById('swal-rol') as HTMLSelectElement).value);
        const password = (document.getElementById('swal-password') as HTMLInputElement).value;

        // Validaciones básicas
        if (!nombre || !apellido || !correo || isNaN(idRol)) {
          Swal.showValidationMessage('Complete todos los campos obligatorios (Nombre, Apellido, Correo, Rol)');
          return false;
        }

        if (!esEdicion && !password) {
          Swal.showValidationMessage('La contraseña es obligatoria para un usuario nuevo');
          return false;
        }

        return { nombre, apellido, correo, telefono, idRol, password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

        const formData = result.value;

        if (esEdicion) {
          // LLAMADA PUT (UsuarioUpdateDto)
          const updateDto: UsuarioUpdateDto = { ...formData };
          this.usuarioService.actualizar(usuarioExistente!.idUsuario, updateDto).subscribe({
            next: () => {
              Swal.fire('¡Actualizado!', 'El usuario fue actualizado.', 'success');
              this.cargarUsuarios();
            },
            error: (err) => Swal.fire('Error', err.error?.mensaje || 'No se pudo actualizar.', 'error')
          });
        } else {
          // LLAMADA POST (UsuarioCreateDto)
          const createDto: UsuarioCreateDto = { ...formData };
          this.usuarioService.crear(createDto).subscribe({
            next: () => {
              Swal.fire('¡Creado!', 'Nuevo usuario registrado.', 'success');
              this.cargarUsuarios();
            },
            error: (err) => Swal.fire('Error', err.error?.mensaje || 'No se pudo crear. Verifica que el correo no esté en uso.', 'error')
          });
        }
      }
    });
  }

  // --- CAMBIAR ESTADO ---
  cambiarEstado(usuario: UsuarioListResponseDto): void {
    const accionText = usuario.estado ? 'bloquear' : 'desbloquear';
    const confirmColor = usuario.estado ? '#d33' : '#28a745';

    Swal.fire({
      title: `¿${accionText.charAt(0).toUpperCase() + accionText.slice(1)} Usuario?`,
      text: `¿Deseas ${accionText} el acceso a ${usuario.nombresCompletos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${accionText}`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.cambiarEstado(usuario.idUsuario).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', `El usuario ha sido ${usuario.estado ? 'bloqueado' : 'desbloqueado'}.`, 'success');
            this.cargarUsuarios();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo cambiar el estado.', 'error');
          }
        });
      }
    });
  }
}