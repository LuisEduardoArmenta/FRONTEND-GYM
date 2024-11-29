import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  user: User = new User();
  errors: string[] = [];
  submitted = false;
  editando = false;
  formChanged = false;
  originalUser: User = new User();

  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.editando = true;
        this.service.findById(id).subscribe({
          next: (user) => {
            this.user = {...user};
            this.originalUser = {...user};
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
          }
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.formChanged && this.editando) {
      Swal.fire('Info', 'No se han realizado cambios', 'info');
      return;
    }

    const operation = this.editando ? 
      this.service.update(this.user) : 
      this.service.create(this.user);

    operation.subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: `Usuario ${this.editando ? 'actualizado' : 'creado'} correctamente`,
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/users']);
        });
      },
      error: (err) => {
        console.error(err);
        if (err.status === 400 && err.error?.errors) {
          this.errors = err.error.errors;
        } else {
          Swal.fire('Error', `No se pudo ${this.editando ? 'actualizar' : 'crear'} el usuario`, 'error');
        }
      }
    });
  }

  onInputChange() {
    if (this.editando) {
      this.formChanged = !this.areObjectsEqual(this.user, this.originalUser);
    } else {
      this.formChanged = true;
    }
  }

  private areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  onClose() {
    this.router.navigate(['/users']);
  }

  onClear(form: NgForm) {
    this.user = new User();
    this.errors = [];
    this.submitted = false;
    this.formChanged = false;
    form.resetForm();
  }
}
