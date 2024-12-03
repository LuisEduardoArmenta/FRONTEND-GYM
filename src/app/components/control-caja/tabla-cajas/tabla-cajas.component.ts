import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Caja } from '../../../models/caja';

@Component({
  selector: 'app-tabla-cajas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-cajas.component.html',
  styleUrls: ['./tabla-cajas.component.css']
})
export class TablaCajasComponent {
  @Input() cajas: Caja[] = [];
}