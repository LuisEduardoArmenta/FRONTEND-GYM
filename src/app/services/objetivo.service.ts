import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Objetivo } from '../models/objetivo.model';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoService {
  private baseUrl = 'http://localhost:8080/api/objetivos';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getObjetivosByUserId(userId: number): Observable<Objetivo[]> {
    const headers = this.getHeaders();
    console.log('Token actual:', sessionStorage.getItem('token'));
    console.log('Headers completos:', headers.keys().map(key => `${key}: ${headers.get(key)}`));
    return this.http.get<Objetivo[]>(`${this.baseUrl}/user/${userId}`, { headers });
  }

  crearObjetivo(objetivo: Objetivo): Observable<Objetivo> {
    const headers = this.getHeaders();
    console.log('Headers al crear:', headers);
    return this.http.post<Objetivo>(this.baseUrl, objetivo, { headers });
  }

  actualizarProgreso(id: number, progreso: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/progreso`, progreso, { headers: this.getHeaders() });
  }

  eliminarObjetivo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
} 