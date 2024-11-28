import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {

  user: User = new User();
  errors: any = [];


  constructor(
    private route: ActivatedRoute,
    private sharingData: SharingDataService,
    private service: UserService,
    private router: Router
  ) {
    this.user = new User();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id']; // El + convierte el string a número
      if (id) {
        this.service.findById(id).subscribe({
          next: (data: User) => {
            this.user = data;
            console.log('Usuario cargado:', this.user);
          },
          error: (error) => {
            console.error('Error al cargar usuario:', error);
            this.errors = error;
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.user.id) {
      // Si el usuario tiene un ID, actualizamos
      this.service.update(this.user).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A1363'
          }).then(() => {
            this.router.navigate(['/users/page/0']);
          });
        },
        error: (err) => {
          console.error('Error en actualización:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el usuario',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A1363'
          });
          this.errors = err;
        }
      });
    } else {
      // Si no tiene ID, creamos un nuevo usuario
      this.service.create(this.user).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario creado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A1363'
          }).then(() => {
            this.router.navigate(['/users/page/0']);
          });
        },
        error: (err) => {
          console.error('Error en creación:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el usuario',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#1A1363'
          });
          this.errors = err;
        }
      });
    }
  }

  onClose() {
    this.router.navigate(['/users/page/0']);
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    userForm.reset();
    userForm.resetForm();
  }

}
