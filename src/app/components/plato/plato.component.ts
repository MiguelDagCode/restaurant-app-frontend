import { Component, OnInit } from '@angular/core';
import { Plato } from '../../models/plato.interface';
import { PlatoService } from '../../services/plato.service';
import { CategoriaPlatoService } from '../../services/categoria-plato.service';
import { CategoriaPlato } from '../../models/categoria-plato.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plato.html',
  styleUrl: './plato.css'
})
export class PlatoComponent implements OnInit {
  platos: Plato[] = [];
  categorias: CategoriaPlato[] = [];
  nuevoPlato: Plato = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: { id: 0, nombre: '' },
    urlImagen: ''
  };
  editando: boolean = false;
  modalVisible: boolean = false;

  constructor(
    private platoService: PlatoService,
    private categoriaService: CategoriaPlatoService
  ) {}

  ngOnInit(): void {
    this.cargarPlatos();
    this.categoriaService.listar().subscribe(res => this.categorias = res);
  }

  cargarPlatos(): void {
    this.platoService.listar().subscribe({
      next: (res) => this.platos = res,
      error: (err) => console.error('Error al listar platos:', err)
    });
  }

  abrirModalCrear(): void {
    this.nuevoPlato = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: { id: 0, nombre: '' },
      urlImagen: ''
    };
    this.editando = false;
    this.modalVisible = true;
  }

  abrirModalEditar(plato: Plato): void {
    this.nuevoPlato = { ...plato };
    this.editando = true;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevoPlato = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: { id: 0, nombre: '' },
      urlImagen: ''
    };
    this.editando = false;
  }

  guardar(): void {
    if (this.editando && this.nuevoPlato.id) {
      this.platoService.actualizar(this.nuevoPlato.id, this.nuevoPlato).subscribe(() => {
        this.cargarPlatos();
        this.cerrarModal();
      });
    } else {
      this.platoService.crear(this.nuevoPlato).subscribe(() => {
        this.cargarPlatos();
        this.cerrarModal();
      });
    }
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar plato?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.platoService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El plato ha sido eliminado.', 'success');
            this.cargarPlatos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el plato.', 'error');
          }
        });
      }
    });
  }
}
