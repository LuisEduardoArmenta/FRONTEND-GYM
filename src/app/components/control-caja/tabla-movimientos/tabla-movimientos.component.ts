import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientoCaja } from '../../../models/movimiento-caja';
import { CajaService } from '../../../services/caja.service';

@Component({
  selector: 'app-tabla-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-movimientos.component.html',
  styleUrls: ['./tabla-movimientos.component.css']
})
export class TablaMovimientosComponent implements OnInit {
  movimientos: MovimientoCaja[] = [];

  constructor(private cajaService: CajaService) {}

  ngOnInit() {
    this.cargarMovimientos();
  }

  cargarMovimientos() {
    this.cajaService.getAllMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        console.log('Movimientos cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar movimientos:', error);
      }
    });
  }
}