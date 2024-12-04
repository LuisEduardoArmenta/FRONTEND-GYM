import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AccessControlService } from '../../services/access-control.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NavbarComponent } from '../navbar/navbar.component';

interface AccessLog {
  id: number;
  user: any;
  accessTime: string;
  accessType: string;
}

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    NavbarComponent,
  ],
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.css']
})
export class AccessControlComponent implements OnInit, OnDestroy {
  private scanner!: Html5QrcodeScanner;
  private accessLogsSubscription!: Subscription;
  private lastScannedQR: string = '';
  private lastScanTime: number = 0;
  private readonly SCAN_COOLDOWN = 3000; // 3 segundos de cooldown
  
  lastResult: any = null;
  accessLogs: AccessLog[] = [];
  qrStatus: 'valid' | 'invalid' | null = null;
  qrMessage: string = '';

  constructor(
    private accessControlService: AccessControlService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.accessLogsSubscription = this.accessControlService.accessLogs$
      .subscribe(logs => this.accessLogs = logs);

    // Inicializar scanner
    setTimeout(() => {
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        this.scanner = new Html5QrcodeScanner(
          'reader',
          {
            qrbox: { width: 250, height: 250 },
            fps: 10  // Reducimos los FPS para disminuir la frecuencia de escaneo
          },
          false
        );
        this.scanner.render(this.onScanSuccess.bind(this), this.onScanError.bind(this));
      } else {
        console.error('Elemento reader no encontrado');
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.scanner) {
      this.scanner.clear();
    }
    if (this.accessLogsSubscription) {
      this.accessLogsSubscription.unsubscribe();
    }
  }

  onScanSuccess(decodedText: string) {
    const currentTime = Date.now();
    
    // Verificar si es el mismo QR y si no ha pasado suficiente tiempo
    if (decodedText === this.lastScannedQR && 
        currentTime - this.lastScanTime < this.SCAN_COOLDOWN) {
      return; // Ignorar el escaneo
    }

    // Actualizar último QR escaneado y tiempo
    this.lastScannedQR = decodedText;
    this.lastScanTime = currentTime;

    try {
      const qrData = JSON.parse(decodedText);
      this.lastResult = qrData;

      // 1. Validar QR
      this.accessControlService.validateQR(qrData).subscribe({
        next: (response: any) => {
          if (response.valid) {
            this.qrStatus = 'valid';
            this.qrMessage = `Acceso permitido: ${response.user.name} ${response.user.lastname}`;
            
            this.accessControlService.registerAccess({
              userId: qrData.id,
              accessType: 'ENTRADA' // Puedes agregar lógica para determinar si es entrada o salida
            }).subscribe({
              next: () => {
                this.toastr.success('Acceso registrado correctamente');
              },
              error: (error: Error) => {
                this.qrStatus = 'invalid';
                this.qrMessage = 'Error al registrar acceso';
                this.toastr.error('Error al registrar acceso');
                console.error('Error:', error);
              }
            });
          } else {
            this.qrStatus = 'invalid';
            this.qrMessage = 'QR inválido o membresía expirada';
            this.toastr.error('QR inválido o membresía expirada');
          }
        },
        error: (error: Error) => {
          this.qrStatus = 'invalid';
          this.qrMessage = 'Error al validar QR';
          this.toastr.error('Error al validar QR');
          console.error('Error:', error);
        }
      });
    } catch (error) {
      this.qrStatus = 'invalid';
      this.qrMessage = 'QR inválido';
      this.toastr.error('QR inválido');
      console.error('Error parsing QR:', error);
    }
  }

  onScanError(errorMessage: string): void {
    // Manejar errores silenciosamente para no molestar al usuario
    console.warn('QR Scan error:', errorMessage);
  }
}