import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private baseUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getHeaders()
    }).pipe(
      map(ventas => ventas.map(venta => ({
        ...venta,
        fecha_venta: new Date(venta.fecha_venta)
      })))
    );
  }

  getVenta(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createVenta(venta: any): Observable<any> {
    return this.http.post(this.baseUrl, venta, {
      headers: this.getHeaders()
    });
  }

  updateVenta(venta: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${venta.idVenta}`, venta, {
      headers: this.getHeaders()
    });
  }

  deleteVenta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getVentasByFecha(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fecha/${fecha}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }

  getVentasByVendedor(vendedor: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/vendedor/${vendedor}`, {
      headers: this.getHeaders(),
      withCredentials: true
    });
  }
}
