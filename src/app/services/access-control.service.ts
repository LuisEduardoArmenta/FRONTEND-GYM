import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Generar QR para un usuario
  generateUserQR(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/qr/generate/${userId}`, {});
  }

  // Validar un QR escaneado
  validateQR(qrData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/qr/validate`, qrData);
  }

  // Registrar un acceso
  registerAccess(accessData: { userId: number; accessType: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/access/register`, accessData);
  }

  // Obtener logs de acceso por usuario
  getUserAccessLogs(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/access/logs/user/${userId}`);
  }

  // Obtener logs por rango de fechas
  getAccessLogsByDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/access/logs/range`, {
      params: { startDate, endDate }
    });
  }
}