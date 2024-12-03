import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private actualizarMovimientosSource = new Subject<void>();
  
  actualizarMovimientos$ = this.actualizarMovimientosSource.asObservable();

  notificarActualizacionMovimientos() {
    this.actualizarMovimientosSource.next();
  }
} 