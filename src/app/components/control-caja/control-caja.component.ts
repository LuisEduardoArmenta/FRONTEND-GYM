import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../services/caja.service';
import { Caja } from '../../models/caja';
import { MovimientoCaja } from '../../models/movimiento-caja';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';
import { MovimientoFormComponent } from './movimiento-form/movimiento-form.component';
import { TablaCajasComponent } from './tabla-cajas/tabla-cajas.component';
import { TablaMovimientosComponent } from './tabla-movimientos/tabla-movimientos.component';

@Component({
  selector: 'app-control-caja',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NavbarComponent, 
    MovimientoFormComponent,
    TablaCajasComponent,
    TablaMovimientosComponent
  ],
  templateUrl: './control-caja.component.html',
  styleUrls: ['./control-caja.component.css']
})
export class ControlCajaComponent implements OnInit {
  cajaActual: Caja | null = null;
  nuevaCaja: Caja = new Caja();
  movimientos: MovimientoCaja[] = [];
  loading = false;
  error: string | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  estadoCaja: string = '';
  tipoMovimiento: string = '';
  historialCajas: Caja[] = [];
  @ViewChild('tablaMovimientos') tablaMovimientos!: TablaMovimientosComponent;

  constructor(private cajaService: CajaService) { }

  ngOnInit(): void {
    this.cargarCajaActual();
    this.cargarHistorialCajas();
  }

  cargarCajaActual() {
    this.loading = true;
    this.error = null;
    
    this.cajaService.getCajaActual().subscribe({
      next: (caja) => {
        console.log('Caja actual recibida:', caja);
        this.cajaActual = caja;
        if (caja && caja.idCaja) {
          this.cargarMovimientos(caja.idCaja);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la caja:', err);
        this.error = 'Error al cargar la información de la caja';
        this.loading = false;
        Swal.fire('Error', this.error, 'error');
      }
    });
  }

  cargarMovimientos(idCaja: number) {
    this.cajaService.getMovimientos(idCaja).subscribe({
      next: (movimientos) => {
        console.log('Movimientos recibidos:', movimientos);
        this.movimientos = movimientos;
      },
      error: (err) => {
        console.error('Error al cargar movimientos:', err);
        Swal.fire('Error', 'No se pudieron cargar los movimientos', 'error');
      }
    });
  }

  abrirCaja(event: Event) {
    event.preventDefault();
    if (!this.nuevaCaja.montoInicial) {
      Swal.fire('Error', 'Debe ingresar un monto inicial', 'error');
      return;
    }

    this.loading = true;
    this.cajaService.abrirCaja(this.nuevaCaja).subscribe({
      next: (caja) => {
        this.cajaActual = caja;
        this.nuevaCaja = new Caja();
        this.loading = false;
        Swal.fire('Éxito', 'Caja abierta correctamente', 'success');
        this.cargarCajaActual();
        this.cargarHistorialCajas();
      },
      error: (err) => {
        console.error('Error al abrir caja:', err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo abrir la caja', 'error');
      }
    });
  }

  registrarMovimiento(movimiento: MovimientoCaja) {
    if (!this.cajaActual?.idCaja) {
        Swal.fire('Error', 'No hay una caja abierta', 'error');
        return;
    }

    if (!movimiento.monto || movimiento.monto <= 0) {
        Swal.fire('Error', 'El monto debe ser mayor a 0', 'error');
        return;
    }

    if (!movimiento.concepto || movimiento.concepto.trim() === '') {
        Swal.fire('Error', 'El concepto es requerido', 'error');
        return;
    }

    if (!movimiento.tipoMovimiento) {
        Swal.fire('Error', 'Debe seleccionar un tipo de movimiento', 'error');
        return;
    }

    this.loading = true;
    this.cajaService.registrarMovimiento(this.cajaActual.idCaja, movimiento).subscribe({
      next: () => {
        this.loading = false;
        this.cargarMovimientos(this.cajaActual!.idCaja!);
        Swal.fire('Éxito', 'Movimiento registrado correctamente', 'success');
        this.tablaMovimientos.cargarMovimientos();
      },
      error: (err) => {
        console.error('Error al registrar movimiento:', err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo registrar el movimiento', 'error');
      }
    });
  }

  cerrarCaja() {
    if (!this.cajaActual?.idCaja) return;

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Va a cerrar la caja actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.cajaActual?.idCaja) {
        this.loading = true;
        this.cajaService.cerrarCaja(this.cajaActual.idCaja).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Caja cerrada correctamente', 'success');
            this.cargarCajaActual();
            this.cargarHistorialCajas();
            this.tablaMovimientos.cargarMovimientos();
          },
          error: (err) => {
            console.error('Error al cerrar caja:', err);
            this.loading = false;
            Swal.fire('Error', 'No se pudo cerrar la caja', 'error');
          }
        });
      }
    });
  }

  calcularTotal(): number {
    const montoInicial = this.cajaActual?.montoInicial || 0;
    return this.movimientos.reduce((total, mov) => {
      return total + (mov.tipoMovimiento === 'INGRESO' ? mov.monto : -mov.monto);
    }, montoInicial);
  }

  onCancelarMovimiento() {
    // No necesitamos hacer nada aquí, el formulario se resetea solo
  }

  cargarHistorialCajas() {
    this.loading = true;
    this.cajaService.getAllCajas().subscribe({
      next: (cajas) => {
        this.historialCajas = cajas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el historial', 'error');
      }
    });
  }

  filtrarCajas() {
    let cajasFiltradas = [...this.historialCajas];

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
    this.cargarHistorialCajas();
  }

  aplicarFiltros() {
    // Los filtros se aplican automáticamente en las funciones filtrarCajas y filtrarMovimientos
  }

  exportarExcel() {
    Swal.fire('Info', 'Función de exportar a Excel en desarrollo', 'info');
  }

  exportarPDF() {
    Swal.fire('Info', 'Función de exportar a PDF en desarrollo', 'info');
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
