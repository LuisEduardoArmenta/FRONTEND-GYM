import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { AccessControlService } from '../../services/access-control.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
  lastResult: any = null;
  accessLogs: AccessLog[] = [];

  constructor(
    private accessControlService: AccessControlService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Esperar a que el DOM esté listo
    setTimeout(() => {
      const readerElement = document.getElementById('reader');
      if (readerElement) {
        this.scanner = new Html5QrcodeScanner(
          'reader',
          {
            qrbox: { width: 250, height: 250 },
            fps: 20
          },
          false
        );
        this.scanner.render(this.onScanSuccess.bind(this), this.onScanError.bind(this));
      } else {
        console.error('Elemento reader no encontrado');
      }
    }, 1000); // Dar más tiempo para que el DOM se renderice
  }

  ngOnDestroy(): void {
    this.scanner.clear();
  }

  onScanSuccess(decodedText: string) {
    try {
      const qrData = JSON.parse(decodedText);
      this.lastResult = qrData;

      // 1. Validar QR
      this.accessControlService.validateQR(qrData).subscribe({
        next: (response: any) => {
          if (response.valid) {
            // 2. Registrar acceso
            this.accessControlService.registerAccess({
              userId: qrData.id,
              accessType: 'ENTRADA' // Puedes agregar lógica para determinar si es entrada o salida
            }).subscribe({
              next: (accessLog: any) => {
                this.accessLogs.unshift(accessLog);
                this.toastr.success('Acceso registrado correctamente');
              },
              error: (error: Error) => {
                this.toastr.error('Error al registrar acceso');
                console.error('Error:', error);
              }
            });
          } else {
            this.toastr.error('QR inválido o membresía expirada');
          }
        },
        error: (error: Error) => {
          this.toastr.error('Error al validar QR');
          console.error('Error:', error);
        }
      });
    } catch (error) {
      this.toastr.error('QR inválido');
      console.error('Error parsing QR:', error);
    }
  }

  onScanError(errorMessage: string): void {
    // Manejar errores silenciosamente para no molestar al usuario
    console.warn('QR Scan error:', errorMessage);
  }
}