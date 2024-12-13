import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  productos: any[] = [];
  terminoBusqueda: string = '';
  loading: boolean = true;
  filtroCategoria: string = '';
  filtroStock: string = '';
  productosOriginal: any[] = [];

  constructor(
    private inventarioService: InventarioService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  get stockBajo(): number {
    return this.productos.filter(p => p.stock < 10).length;
  }

  get totalValor(): number {
    return this.productos.reduce((total, p) => total + (p.precio * p.stock), 0);
  }

  get categorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  get totalProductos(): number {
    return this.productos.length;
  }

  cargarProductos(): void {
    this.loading = true;
    this.inventarioService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.map(producto => ({
          ...producto,
        }));
        this.productosOriginal = [...this.productos];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
        Swal.fire('Error', 'Error al cargar los productos', 'error');
      }
    });
  }

  crearProducto(): void {
    this.router.navigate(['/inventario/crear']);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/inventario/editar', id]);
  }

  eliminarProducto(idProducto: number): void {
    if (!idProducto) {
      console.error('ID no válido:', idProducto);
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.deleteProducto(idProducto).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            this.cargarProductos();
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }

  buscarProducto(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.cargarProductos();
    } else {
      this.productos = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  aplicarFiltros(): void {
    let productosFiltrados = [...this.productosOriginal];

    if (this.filtroCategoria) {
        productosFiltrados = productosFiltrados.filter(p => 
            p.categoria === this.filtroCategoria);
    }

    if (this.filtroStock) {
        if (this.filtroStock === 'bajo') {
            productosFiltrados = productosFiltrados.filter(p => p.stock < 10);
        } else if (this.filtroStock === 'normal') {
            productosFiltrados = productosFiltrados.filter(p => p.stock >= 10);
        }
    }

    this.productos = productosFiltrados;
  }
}