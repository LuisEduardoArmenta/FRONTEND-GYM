import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { ProductoService } from '../../../services/producto.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-ventas-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './ventas-form.component.html',
  styleUrl: './ventas-form.component.css'
})
export class VentasFormComponent implements OnInit {
  title: string = 'Nueva Venta';
  venta: any = {
    producto: null,
    cantidad: 1,
    total: 0,
    vendedor: ''
  };
  productos: any[] = [];
  errors: string[] = [];
  editando: boolean = false;

  constructor(
    private ventasService: VentasService,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editando = true;
        this.title = 'Editar Venta';
        this.cargarVenta(params['id']);
      }
    });
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => this.productos = productos,
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  cargarVenta(id: number): void {
    this.ventasService.getVenta(id).subscribe({
      next: (venta) => this.venta = venta,
      error: (error) => console.error('Error al cargar venta:', error)
    });
  }

  onSubmit(): void {
    if (this.editando) {
      this.ventasService.updateVenta(this.venta).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Venta actualizada correctamente', 'success');
          this.router.navigate(['/ventas']);
        },
        error: (error) => this.manejarError(error)
      });
    } else {
      this.ventasService.createVenta(this.venta).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Venta creada correctamente', 'success');
          this.router.navigate(['/ventas']);
        },
        error: (error) => this.manejarError(error)
      });
    }
  }

  manejarError(error: any): void {
    this.errors = Array.isArray(error.error) ? error.error : ['Error al procesar la operación'];
    console.error('Error:', error);
  }

  onClose(): void {
    this.router.navigate(['/ventas']);
  }

  calcularTotal(): void {
    if (this.venta.producto && this.venta.cantidad) {
      this.venta.total = this.venta.producto.precio * this.venta.cantidad;
    }
  }
}
