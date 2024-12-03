import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../../services/caja.service';
import { TablaCajasComponent } from '../tabla-cajas/tabla-cajas.component';
import { TablaMovimientosComponent } from '../tabla-movimientos/tabla-movimientos.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Caja } from '../../../models/caja';
import { MovimientoCaja } from '../../../models/movimiento-caja';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historial-cajas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TablaCajasComponent, 
    TablaMovimientosComponent, 
    NavbarComponent
  ],
  templateUrl: './historial-cajas.component.html',
  styleUrls: ['./historial-cajas.component.css']
})
export class HistorialCajasComponent implements OnInit {
  cajas: Caja[] = [];
  movimientos: MovimientoCaja[] = [];
  loading = false;
  error: string | null = null;
  
  fechaInicio: string = '';
  fechaFin: string = '';
  estadoCaja: string = '';
  tipoMovimiento: string = '';

  constructor(private cajaService: CajaService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.loading = true;
    this.error = null;

    this.cajaService.getAllCajas().subscribe({
      next: (cajas) => {
        this.cajas = cajas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar cajas:', err);
        this.error = 'Error al cargar el historial de cajas';
        this.loading = false;
        Swal.fire('Error', this.error, 'error');
      }
    });

    this.cajaService.getAllMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos = movimientos;
      },
      error: (err) => {
        console.error('Error al cargar movimientos:', err);
        this.error = 'Error al cargar el historial de movimientos';
        Swal.fire('Error', this.error, 'error');
      }
    });
  }

  filtrarCajas() {
    let cajasFiltradas = [...this.cajas];

    if (this.fechaInicio) {
      const fechaInicioDate = new Date(this.fechaInicio);
      cajasFiltradas = cajasFiltradas.filter(caja => {
        const fechaApertura = caja.fechaApertura ? new Date(caja.fechaApertura) : null;
        return fechaApertura ? fechaApertura >= fechaInicioDate : false;
      });
    }

    if (this.fechaFin) {
      const fechaFinDate = new Date(this.fechaFin);
      cajasFiltradas = cajasFiltradas.filter(caja => {
        const fechaApertura = caja.fechaApertura ? new Date(caja.fechaApertura) : null;
        return fechaApertura ? fechaApertura <= fechaFinDate : false;
      });
    }

    if (this.estadoCaja) {
      cajasFiltradas = cajasFiltradas.filter(caja => 
        caja.estado === this.estadoCaja
      );
    }

    return cajasFiltradas;
  }

  filtrarMovimientos() {
    let movimientosFiltrados = [...this.movimientos];

    if (this.fechaInicio) {
      const fechaInicioDate = new Date(this.fechaInicio);
      movimientosFiltrados = movimientosFiltrados.filter(mov => {
        const fechaMov = mov.fechaMovimiento ? new Date(mov.fechaMovimiento) : null;
        return fechaMov ? fechaMov >= fechaInicioDate : false;
      });
    }

    if (this.fechaFin) {
      const fechaFinDate = new Date(this.fechaFin);
      movimientosFiltrados = movimientosFiltrados.filter(mov => {
        const fechaMov = mov.fechaMovimiento ? new Date(mov.fechaMovimiento) : null;
        return fechaMov ? fechaMov <= fechaFinDate : false;
      });
    }

    if (this.tipoMovimiento) {
      movimientosFiltrados = movimientosFiltrados.filter(mov => 
        mov.tipoMovimiento === this.tipoMovimiento
      );
    }

    return movimientosFiltrados;
  }

  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.estadoCaja = '';
    this.tipoMovimiento = '';
    this.cargarHistorial();
  }

  calcularTotales() {
    const movimientosFiltrados = this.filtrarMovimientos();
    const ingresos = movimientosFiltrados
      .filter(m => m.tipoMovimiento === 'INGRESO')
      .reduce((sum, m) => sum + (m.monto || 0), 0);
    
    const egresos = movimientosFiltrados
      .filter(m => m.tipoMovimiento === 'EGRESO')
      .reduce((sum, m) => sum + (m.monto || 0), 0);

    return {
      ingresos,
      egresos,
      balance: ingresos - egresos
    };
  }
}