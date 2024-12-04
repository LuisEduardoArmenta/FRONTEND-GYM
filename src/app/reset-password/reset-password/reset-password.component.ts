import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  submitted: boolean = false;
  showResetForm: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRequestReset() {
    this.submitted = true;
    if (!this.email) {
      Swal.fire('Error', 'El correo electrónico es requerido', 'error');
      return;
    }

    this.authService.requestPasswordReset(this.email).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Se ha enviado un código a tu correo', 'success');
        this.showResetForm = true;
      },
      error: (error) => {
        Swal.fire('Error', error.error.error || 'Error al solicitar el reset', 'error');
      }
    });
  }

  onResetPassword() {
    this.submitted = true;
    if (!this.token || !this.newPassword) {
      Swal.fire('Error', 'Todos los campos son requeridos', 'error');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        Swal.fire('Error', error.error.error || 'Error al cambiar la contraseña', 'error');
      }
    });
  }
}
