import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private baseUrl: string = 'http://localhost:8080/api/productos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, producto, { headers: this.getHeaders() });
  }

  updateProducto(idProducto: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${idProducto}`, producto, { headers: this.getHeaders() });
  }

  deleteProducto(idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idProducto}`, { headers: this.getHeaders() });
  }

  buscarProductos(termino: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/buscar/${termino}`, { headers: this.getHeaders() });
  }
}
