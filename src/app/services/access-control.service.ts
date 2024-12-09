import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface AccessLog {
  id: number;
  user: any;
  accessTime: string;
  accessType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private apiUrl = 'http://localhost:8080';
  
  // BehaviorSubject para mantener los últimos accesos
  private accessLogsSubject = new BehaviorSubject<AccessLog[]>([]);
  public accessLogs$ = this.accessLogsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar logs iniciales
    this.loadInitialLogs();
  }

  private loadInitialLogs() {
    // Obtener los últimos 10 accesos al iniciar
    this.http.get<AccessLog[]>(`${this.apiUrl}/api/access/logs/recent`).subscribe({
      next: (logs) => this.accessLogsSubject.next(logs),
      error: (error) => console.error('Error cargando logs:', error)
    });
  }

  // Método para agregar un nuevo log
  addAccessLog(log: AccessLog) {
    const currentLogs = this.accessLogsSubject.value;
    this.accessLogsSubject.next([log, ...currentLogs]);
  }

  registerAccess(accessData: { userId: number; accessType: string }): Observable<AccessLog> {
    return new Observable<AccessLog>(observer => {
      this.http.post<AccessLog>(`${this.apiUrl}/api/access/register`, accessData).subscribe({
        next: (newLog: AccessLog) => {
          this.addAccessLog(newLog);
          observer.next(newLog);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Generar QR para un usuario
  generateUserQR(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/qr/generate/${userId}`, {});
  }

  // Validar un QR escaneado
  validateQR(qrData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/qr/validate`, qrData);
  }

  // Mandar QR al correo electronico 
  sendQrToEmail(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/qr/send/${userId}`, {});
  }

  
  getUserAccessLogs(userId: number): Observable<AccessLog[]> {
    return this.http.get<AccessLog[]>(`${this.apiUrl}/api/access/logs/user/${userId}`);
  }

  getAccessLogsByDateRange(startDate: string, endDate: string): Observable<AccessLog[]> {
    return this.http.get<AccessLog[]>(`${this.apiUrl}/api/access/logs/range`, {
      params: { startDate, endDate }
    });
  }
}