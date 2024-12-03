import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoCaja } from '../../../models/movimiento-caja';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css']
})
export class MovimientoFormComponent {
  @Input() loading = false;
  @Output() guardar = new EventEmitter<MovimientoCaja>();
  @Output() cancelar = new EventEmitter<void>();

  movimiento: MovimientoCaja = new MovimientoCaja();

  onSubmit(event: Event) {
    event.preventDefault();
    this.movimiento.fechaMovimiento = new Date();
    this.guardar.emit(this.movimiento);
    this.movimiento = new MovimientoCaja();
  }

  onCancel() {
    this.cancelar.emit();
    this.movimiento = new MovimientoCaja();
  }
}
