import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User();
  errors: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  onSubmit(): void {
    if (this.validateForm()) {
      // Elimina campos innecesarios o nulos
      const userToSend = {
        name: this.user.name,
        lastname: this.user.lastname,
        email: this.user.email,
        username: this.user.username,
        password: this.user.password
      };
  
      this.authService.register(userToSend).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Ya puedes iniciar sesión con tus credenciales',
            confirmButtonText: 'Ir al login'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          console.error('Error completo:', error);
          if (error.status === 403) {
            Swal.fire('Error', 'No tienes permisos para realizar esta acción', 'error');
          } else if (error.status === 400) {
            this.errors = error.error;
          } else {
            Swal.fire('Error', 'Ocurrió un error al registrar el usuario', 'error');
          }
        }
      });
    }
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.user.name?.trim()) {
      this.errors.name = 'El nombre es requerido';
      isValid = false;
    }
    if (!this.user.lastname?.trim()) {
      this.errors.lastname = 'El apellido es requerido';
      isValid = false;
    }
    if (!this.user.email?.trim()) {
      this.errors.email = 'El email es requerido';
      isValid = false;
    }
    if (!this.user.username?.trim()) {
      this.errors.username = 'El nombre de usuario es requerido';
      isValid = false;
    }
    if (!this.user.password?.trim()) {
      this.errors.password = 'La contraseña es requerida';
      isValid = false;
    }

    return isValid;
  }

  onClear(): void {
    this.user = new User();
    this.errors = {};
  }
}