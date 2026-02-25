import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2';
import { Insumo } from '../../../models/Insumo';
import { InsumoService } from '../../../services/insumo.service';

@Component({
  selector: 'app-insumos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insumos.html',
  styleUrls: ['./insumos.css']
})
export class InsumosComponent implements OnInit {

  insumosOriginales: Insumo[] = [];
  insumosFiltrados: Insumo[] = [];
  
  // Variables para los filtros
  terminoBusqueda: string = '';
  unidadSeleccionada: string = '';

  constructor(private insumoService: InsumoService) {}

  ngOnInit(): void {
    this.cargarInsumos();
  }

  cargarInsumos(): void {
    this.insumoService.findAll().subscribe({
      next: (data) => {
        this.insumosOriginales = data;
        this.aplicarFiltros(); // Pintamos la tabla
      },
      error: (err) => {
        console.error('Error al cargar insumos', err);
        Swal.fire('Error', 'No se pudieron cargar los insumos', 'error');
      }
    });
  }

  // --- LÓGICA DE FILTRADO Y ESTADO ---

  aplicarFiltros(): void {
    let filtrado = this.insumosOriginales;

    // 1. Filtrar por término de búsqueda (Nombre)
    if (this.terminoBusqueda.trim() !== '') {
      filtrado = filtrado.filter(i => 
        i.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }

    // 2. Filtrar por Unidad
    if (this.unidadSeleccionada !== '') {
      filtrado = filtrado.filter(i => i.unidadMedida === this.unidadSeleccionada);
    }

    this.insumosFiltrados = filtrado;
  }

  determinarEstado(insumo: Insumo): { texto: string, clase: string } {
    if (insumo.stockActual <= 0) {
      return { texto: 'Crítico', clase: 'badge-soft-danger text-danger bg-danger-subtle border border-danger-subtle' };
    } else if (insumo.stockActual <= insumo.stockMinimo) {
      return { texto: 'Bajo', clase: 'badge-soft-warning text-warning-emphasis bg-warning-subtle border border-warning-subtle' };
    } else {
      return { texto: 'Normal', clase: 'badge-soft-success text-success bg-success-subtle border border-success-subtle' };
    }
  }

  // --- ACCIONES CRUD CON SWEETALERT ---

  abrirModalInsumo(insumoExistente?: Insumo): void {
    const esEdicion = !!insumoExistente;
    
    // HTML del formulario inyectado en SweetAlert
    const htmlFormulario = `
      <div class="text-start mt-3">
        <label class="form-label fw-bold small text-muted">Nombre del Insumo</label>
        <input id="swal-nombre" class="form-control mb-3" value="${esEdicion ? insumoExistente.nombre : ''}" style="text-transform: uppercase;">
        
        <div class="row">
          <div class="col-6 mb-3">
            <label class="form-label fw-bold small text-muted">Stock Actual</label>
            <input id="swal-stock" type="number" step="0.001" class="form-control" value="${esEdicion ? insumoExistente.stockActual : '0.000'}">
          </div>
          <div class="col-6 mb-3">
            <label class="form-label fw-bold small text-muted">Stock Mínimo</label>
            <input id="swal-minimo" type="number" step="0.001" class="form-control" value="${esEdicion ? insumoExistente.stockMinimo : '0.000'}">
          </div>
        </div>

        <label class="form-label fw-bold small text-muted">Unidad de Medida</label>
        <select id="swal-unidad" class="form-select mb-3">
          <option value="KG" ${esEdicion && insumoExistente.unidadMedida === 'KG' ? 'selected' : ''}>Kilogramos (KG)</option>
          <option value="LT" ${esEdicion && insumoExistente.unidadMedida === 'LT' ? 'selected' : ''}>Litros (LT)</option>
          <option value="UNIDAD" ${esEdicion && insumoExistente.unidadMedida === 'UNIDAD' ? 'selected' : ''}>Unidades (UN)</option>
        </select>
      </div>
    `;

    Swal.fire({
      title: esEdicion ? 'Editar Insumo' : 'Nuevo Insumo',
      html: htmlFormulario,
      showCancelButton: true,
      confirmButtonText: 'Guardar Insumo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FF6B35',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.toUpperCase();
        const stockActual = parseFloat((document.getElementById('swal-stock') as HTMLInputElement).value);
        const stockMinimo = parseFloat((document.getElementById('swal-minimo') as HTMLInputElement).value);
        const unidadMedida = (document.getElementById('swal-unidad') as HTMLSelectElement).value;

        if (!nombre || isNaN(stockActual) || isNaN(stockMinimo)) {
          Swal.showValidationMessage('Por favor completa todos los campos correctamente');
          return false;
        }

        return { nombre, stockActual, stockMinimo, unidadMedida };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

        const dataGuardar: Insumo = result.value;

        if (esEdicion) {
          // LLAMADA PUT
          this.insumoService.update(insumoExistente.idInsumo!, dataGuardar).subscribe({
            next: () => {
              Swal.fire('¡Actualizado!', 'Insumo actualizado con éxito.', 'success');
              this.cargarInsumos();
            },
            error: (err) => Swal.fire('Error', 'No se pudo actualizar.', 'error')
          });
        } else {
          // LLAMADA POST
          this.insumoService.insert(dataGuardar).subscribe({
            next: () => {
              Swal.fire('¡Creado!', 'Nuevo insumo registrado con éxito.', 'success');
              this.cargarInsumos();
            },
            error: (err) => Swal.fire('Error', 'No se pudo crear.', 'error')
          });
        }
      }
    });
  }

  eliminarInsumo(insumo: Insumo): void {
    // Como solicitaste, solo muestra la alerta sin hacer nada en el backend
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El insumo "${insumo.nombre}" será marcado para eliminación.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Eliminado!',
          'El insumo ha sido eliminado ',
          'success'
        );
      }
    });
  }
}