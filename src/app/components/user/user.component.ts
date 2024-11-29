import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PaginatorusersComponent } from '../paginatorusers/paginatorusers.component';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, PaginatorusersComponent, NavbarComponent, CommonModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  title: string = 'Listado de usuarios';
  users: User[] = [];
  paginator: any = {};

  constructor(
    private service: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.route.paramMap.subscribe(params => {
      const page = +(params.get('page') ?? 0);
      this.service.findAllPageable(page).subscribe({
        next: (response) => {
          this.users = response.content;
          this.paginator = response;
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
      });
    });
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  onRemoveUser(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== id);
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
