import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserAppComponent } from '../user-app/user-app.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, RouterLink, UserAppComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
  user: User;
  submitted: boolean = false;
  errors: any = {};

  constructor(
    private sharingData: SharingDataService,
    private router: Router,
    private authService: AuthService
  ) {
    this.user = new User();
  }

  ngOnInit() {
    // Suscribirse al loginResponse$
    this.sharingData.loginResponse$.subscribe(
      (response) => {
        if (response && response.token) {
          this.router.navigate(['/users/page/0']);
        }
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    
    if(!this.user.username || !this.user.password) {
      Swal.fire(
        'Error de validación',
        'Usuario y contraseña son requeridos',
        'error'
      );
    } else {
      // Llamar directamente al servicio de autenticación
      this.authService.loginUser({
        username: this.user.username, 
        password: this.user.password
      }).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          const token = response.token;
          const payload = this.authService.getPayload(token);

          const user = { username: payload.sub };
          const login = { 
            user,
            isAuth: true,
            isAdmin: payload.isAdmin,
          }

          this.authService.token = token;
          this.authService.user = login;
          
          this.router.navigate(['/users/page/0']);
        },
        error: (error) => {
          console.error('Error en login:', error);
          if(error.status == 401) {
            Swal.fire('Error en el login', error.error.message, 'error');
          } else {
            throw error;
          }
        }
      });
    }
  }
}