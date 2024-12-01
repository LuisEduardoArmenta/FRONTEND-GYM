import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {
  title: string = 'Gestión de Ventas';
  ventas: any[] = [];
  loading: boolean = true;
  totalVentas: number = 0;
  totalProductos: number = 0;
  ventasHoy: number = 0;
  productosTop: number = 0;

  constructor(
    private ventasService: VentasService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.calcularEstadisticas();
  }

  cargarVentas(): void {
    this.loading = true;
    this.ventasService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.calcularEstadisticas();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.loading = false;
        if (error.status === 401 || error.status === 403) {
          Swal.fire('Error', 'No tiene permisos para acceder a este recurso', 'error');
          this.router.navigate(['/login']);
        } else {
          Swal.fire('Error', 'Error al cargar las ventas', 'error');
        }
      }
    });
  }

  calcularEstadisticas(): void {
    // Calcular total de ventas
    this.totalVentas = this.ventas.reduce((total, venta) => total + Number(venta.total), 0);
    
    // Calcular total de productos vendidos
    this.totalProductos = this.ventas.reduce((total, venta) => total + Number(venta.cantidad), 0);
    
    // Calcular ventas del día
    const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.ventasHoy = this.ventas.filter(venta => 
      venta.fechaVenta.split('T')[0] === hoy
    ).length;
    
    // Calcular productos únicos vendidos
    const productosUnicos = new Set(this.ventas.map(venta => venta.producto.idProducto));
    this.productosTop = productosUnicos.size;

    console.log('Estadísticas calculadas:', {
      totalVentas: this.totalVentas,
      totalProductos: this.totalProductos,
      ventasHoy: this.ventasHoy,
      productosTop: this.productosTop
    });
  }

  crearVenta(): void {
    this.router.navigate(['/ventas/crear']);
  }

  editarVenta(id: number): void {
    this.router.navigate(['/ventas/editar', id]);
  }
  get admin(): boolean {
    return this.authService.isAdmin();
  }

  eliminarVenta(id: number): void {
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
        this.ventasService.deleteVenta(id).subscribe({
          next: () => {
            this.ventas = this.ventas.filter(venta => venta.idVenta !== id);
            this.calcularEstadisticas();
            Swal.fire('Eliminado', 'La venta ha sido eliminada.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar la venta', 'error');
          }
        });
      }
    });
  }
}
