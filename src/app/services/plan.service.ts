import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private url: string = 'http://localhost:8080/api/planes';

  constructor(private http: HttpClient) { }

  getPlanes(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getPlan(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  findAll(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.url);
  }

  findById(id: number): Observable<Plan> {
    return this.http.get<Plan>(`${this.url}/${id}`);
  }

  create(plan: Plan): Observable<Plan> {
    return this.http.post<Plan>(this.url, plan);
  }

  update(id: number, plan: Plan): Observable<Plan> {
    return this.http.put<Plan>(`${this.url}/${id}`, plan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
