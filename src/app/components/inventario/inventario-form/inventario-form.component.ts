import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { InventarioService } from '../../../services/inventario.service';
import { Producto } from '../../../models/producto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.css']
})
export class InventarioFormComponent implements OnInit {
  producto: Producto = {
    idProducto: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
  };
  
  titulo: string = 'Crear Producto';
  botonTexto: string = 'Crear';
  
  constructor(
    private inventarioService: InventarioService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.titulo = 'Editar Producto';
        this.botonTexto = 'Actualizar';
        this.cargarProducto(params['id']);
      }
    });
  }

  cargarProducto(id: number): void {
    this.inventarioService.getProducto(id).subscribe({
      next: (data) => {
        this.producto = data;
      },
      error: (error) => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error al cargar el producto', 'error');
      }
    });
  }

  guardarProducto(): void {
    if (this.validarFormulario()) {      
      if (this.producto.idProducto) {
        this.inventarioService.updateProducto(this.producto.idProducto, this.producto).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto actualizado correctamente', 'success');
            this.router.navigate(['/inventario']);
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error al actualizar el producto', 'error');
          }
        });
      } else {
        this.inventarioService.createProducto(this.producto).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Producto creado correctamente', 'success');
            this.router.navigate(['/inventario']);
          },
          error: (error) => {
            console.error('Error:', error);
            Swal.fire('Error', 'Error al crear el producto', 'error');
          }
        });
      }
    }
  }

  validarFormulario(): boolean {
    if (!this.producto.nombre.trim()) {
      Swal.fire('Error', 'El nombre es obligatorio', 'error');
      return false;
    }
    if (!this.producto.descripcion.trim()) {
      Swal.fire('Error', 'La descripción es obligatoria', 'error');
      return false;
    }
    if (this.producto.precio <= 0) {
      Swal.fire('Error', 'El precio debe ser mayor a 0', 'error');
      return false;
    }
    if (this.producto.stock < 0) {
      Swal.fire('Error', 'El stock no puede ser negativo', 'error');
      return false;
    }
    if (!this.producto.categoria.trim()) {
      Swal.fire('Error', 'La categoría es obligatoria', 'error');
      return false;
    }
    return true;
  }
}
