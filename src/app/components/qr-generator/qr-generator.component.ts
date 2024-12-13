import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';
import { AccessControlService } from '../../services/access-control.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner'
import { NgxSpinnerModule } from 'ngx-spinner';
@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, NgxSpinnerModule],
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.css']
})
export class QrGeneratorComponent implements OnInit {
  qrImageUrl: string = '';
  loading: boolean = false;
  spinnerVisible: boolean = false;
  userData = {
    id: '',
    name: '',
    membership: ''
  };

  constructor(
    private accessControlService: AccessControlService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['userId']) {
        this.userData = {
          id: params['userId'],
          name: params['name'],
          membership: params['membership']
        };
        this.generateQR();
      }
    });
  }

  generateQR() {
    this.loading = true;
    
    // Intentar primero con el backend
    this.accessControlService.generateUserQR(this.userData.id).subscribe({
      next: (response) => {
        this.generateQRCode(response);
      },
      error: (error) => {
        console.error('Error con el backend, usando generación local:', error);
        // Si falla el backend, usar generación local
        this.accessControlService.generateUserQR(this.userData.id).subscribe({
          next: (localData: any) => {
            this.generateQRCode(localData);
          }
        });
      }
    });
  }

  private generateQRCode(data: any) {
    QRCode.toDataURL(JSON.stringify(data))
      .then(url => {
        this.qrImageUrl = url;
        this.loading = false;
      })
      .catch(err => {
        console.error('Error generando QR:', err);
        this.loading = false;
        this.toastr.error('Error al generar QR');
      });
  }

  downloadQR() {
    if (!this.qrImageUrl) {
      this.toastr.warning('Primero genera un QR');
      return;
    }
    const link = document.createElement('a');
    link.download = `qr-${this.userData.id}.png`;
    link.href = this.qrImageUrl;
    link.click();
  }

  sendQRToEmail() {
    if (!this.userData.id) {
      Swal.fire('Error', 'Debes proporcionar el ID del usuario.', 'error');
      return;
    }
  
    this.spinner.show(); // Mostrar el spinner
    this.accessControlService.sendQrToEmail(Number(this.userData.id))
      .subscribe({
        next: () => {
          this.spinner.hide(); // Ocultar el spinner
          Swal.fire('Éxito', 'Correo enviado exitosamente.', 'success');
        },
        error: (err) => {
          this.spinner.hide(); // Ocultar el spinner también en caso de error
          Swal.fire('Error', err.error?.mensaje || 'No se pudo enviar el correo.', 'error');
        }
      });
    }
    
    onClose(){
      this.router.navigate(['/membresia']);
    }
}
