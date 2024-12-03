import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Caja } from '../models/caja';
import { MovimientoCaja } from '../models/movimiento-caja';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private baseUrl = 'http://localhost:8080/api/caja';

  constructor(private http: HttpClient) { }

  private getRequestOptions() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  abrirCaja(caja: Caja): Observable<Caja> {
    return this.http.post<Caja>(`${this.baseUrl}/abrir`, caja, this.getRequestOptions());
  }

  getCajaActual(): Observable<Caja> {
    return this.http.get<Caja>(`${this.baseUrl}/actual`, this.getRequestOptions());
  }

  cerrarCaja(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/cerrar/${id}`, {}, this.getRequestOptions());
  }

  registrarMovimiento(idCaja: number, movimiento: any): Observable<MovimientoCaja> {
    const url = `${this.baseUrl}/${idCaja}/movimientos`;
    console.log('Enviando movimiento:', movimiento); // Para debug
    return this.http.post<MovimientoCaja>(url, movimiento, this.getRequestOptions());
  }

  getMovimientos(idCaja: number): Observable<MovimientoCaja[]> {
    return this.http.get<MovimientoCaja[]>(
      `${this.baseUrl}/${idCaja}/movimientos`, 
      this.getRequestOptions()
    );
  }

  getAllCajas(): Observable<Caja[]> {
    return this.http.get<Caja[]>(`${this.baseUrl}`, this.getRequestOptions());
  }

  getAllMovimientos(): Observable<MovimientoCaja[]> {
    return this.http.get<MovimientoCaja[]>('http://localhost:8080/api/movimientos');
  }
}
