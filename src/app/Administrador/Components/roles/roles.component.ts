import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RolService } from '../../../services/rol.service';
import { Rol } from '../../../models/Rol';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class RolesComponent implements OnInit {

  rolesOriginales: Rol[] = [];
  rolesFiltrados: Rol[] = [];
  terminoBusqueda: string = '';

  constructor(private rolService: RolService) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolService.listarTodos().subscribe({
      next: (data) => {
        this.rolesOriginales = data;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Error al cargar roles', err);
        Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
      }
    });
  }

  aplicarFiltro(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.rolesFiltrados = this.rolesOriginales;
    } else {
      this.rolesFiltrados = this.rolesOriginales.filter(r => 
        r.nombreRol.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  abrirModalRol(rolExistente?: Rol): void {
    const esEdicion = !!rolExistente;
    
    Swal.fire({
      title: esEdicion ? 'Editar Rol' : 'Nuevo Rol',
      html: `
        <div class="text-start mt-3">
          <label class="form-label fw-bold small text-muted">Nombre del Rol </label>
          <input id="swal-nombre-rol" class="form-control" value="${esEdicion ? rolExistente.nombreRol : ''}" style="text-transform: uppercase;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Rol',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FF6B35', // Tu naranja
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre-rol') as HTMLInputElement).value.toUpperCase().trim();
        if (!nombre) {
          Swal.showValidationMessage('El nombre del rol es obligatorio');
          return false;
        }
        return { nombreRol: nombre };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({ title: 'Procesando...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

        const rolAGuardar: Rol = result.value;

        if (esEdicion) {
          this.rolService.actualizar(rolExistente.idRol!, rolAGuardar).subscribe({
            next: () => {
              Swal.fire('¡Actualizado!', 'El rol fue actualizado correctamente.', 'success');
              this.cargarRoles();
            },
            error: (err) => Swal.fire('Error', 'No se pudo actualizar el rol.', 'error')
          });
        } else {
          this.rolService.crear(rolAGuardar).subscribe({
            next: () => {
              Swal.fire('¡Creado!', 'Nuevo rol registrado correctamente.', 'success');
              this.cargarRoles();
            },
            error: (err) => Swal.fire('Error', 'No se pudo crear el rol. Verifica que el nombre no esté duplicado.', 'error')
          });
        }
      }
    });
  }

  // --- CAMBIAR ESTADO (Soft Delete) ---
  cambiarEstado(rol: Rol): void {
    const accionText = rol.activo ? 'deshabilitar' : 'habilitar';
    const confirmColor = rol.activo ? '#d33' : '#28a745';

    Swal.fire({
      title: `¿${accionText.charAt(0).toUpperCase() + accionText.slice(1)} Rol?`,
      text: `¿Estás seguro que deseas ${accionText} el rol "${rol.nombreRol}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${accionText}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolService.cambiarEstado(rol.idRol!).subscribe({
          next: () => {
            Swal.fire('¡Éxito!', `El rol ahora está ${rol.activo ? 'inactivo' : 'activo'}.`, 'success');
            this.cargarRoles();
          },
          error: (err) => {
            console.error('Error al cambiar estado', err);
            Swal.fire('Error', 'No se pudo cambiar el estado del rol.', 'error');
          }
        });
      }
    });
  }
}