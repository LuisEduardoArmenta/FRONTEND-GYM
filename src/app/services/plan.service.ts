import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private baseUrl: string = 'http://localhost:8080/api/planes';

  constructor(private http: HttpClient) { }

  getPlanes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getPlan(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
