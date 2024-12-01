import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  getProducto(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createProducto(producto: any): Observable<any> {
    return this.http.post(this.baseUrl, producto, {
      headers: this.getHeaders()
    });
  }

  updateProducto(producto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${producto.idProducto}`, producto, {
      headers: this.getHeaders()
    });
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
