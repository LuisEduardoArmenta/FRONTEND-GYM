import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {
  private baseUrl: string = 'http://localhost:8080/api/membresias';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`,
      'Content-Type': 'application/json'
    });
  }

  getMembresias(): Observable<any[]> {
    const headers = this.getHeaders();
    console.log('Headers:', headers); // Para debugging
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  getMembresia(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  createMembresia(membresia: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, membresia, { headers: this.getHeaders() });
  }

  updateMembresia(id: number, membresia: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, membresia, { headers: this.getHeaders() });
  }

  deleteMembresia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}
