import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientoCaja } from '../../../models/movimiento-caja';

@Component({
  selector: 'app-tabla-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-movimientos.component.html',
  styleUrls: ['./tabla-movimientos.component.css']
})
export class TablaMovimientosComponent {
  @Input() movimientos: MovimientoCaja[] = [];
}