import { Component, OnInit } from '@angular/core';
import { CategoriaPlato } from '../../models/categoria-plato.interface';
import { CategoriaPlatoService } from '../../services/categoria-plato.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-plato',
    standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-plato.html',
  styleUrl: './categoria-plato.css'
})
export class CategoriaPlatoComponent implements OnInit {
  categorias: CategoriaPlato[] = [];
  nuevaCategoria: CategoriaPlato = { 
    nombre: '' };
  editando: boolean = false;
  modalVisible: boolean = false;

  constructor(private categoriaService: CategoriaPlatoService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (res) => this.categorias = res,
      error: (err) => console.error('Error al listar categorías:', err)
    });
  }

  abrirModalCrear(): void {
    this.nuevaCategoria = { nombre: '' };
    this.editando = false;
    this.modalVisible = true;
  }

  abrirModalEditar(categoria: CategoriaPlato): void {
    this.nuevaCategoria = { ...categoria };
    this.editando = true;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevaCategoria = { nombre: '' };
    this.editando = false;
  }

  guardar(): void {
    if (this.editando && this.nuevaCategoria.id) {
      this.categoriaService.actualizar(this.nuevaCategoria.id, this.nuevaCategoria).subscribe(() => {
        this.cargarCategorias();
        this.cerrarModal();
      });
    } else {
      this.categoriaService.crear(this.nuevaCategoria).subscribe(() => {
        this.cargarCategorias();
        this.cerrarModal();
      });
    }
  }

eliminar(id: number): void {
  Swal.fire({
    title: '¿Eliminar categoría?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.categoriaService.eliminar(id).subscribe({
        next: () => {
          Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
          this.cargarCategorias();
        },
        error: () => {
          Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
        }
      });
    }
  });
}
}