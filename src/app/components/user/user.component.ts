import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { PaginatorusersComponent } from '../paginatorusers/paginatorusers.component';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'user',
  standalone: true,
  imports: [RouterModule, PaginatorusersComponent, NavbarComponent],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  title: string = 'Listado de usuarios!';

  
  users: User[] = [];
  paginator: any = {};

  constructor(
    private service: UserService,
    private sharingData: SharingDataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {

      if(this.router.getCurrentNavigation()?.extras.state){
        this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
        this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
      }
    }
  ngOnInit(): void {
    if(this.users == undefined || this.users == null || this.users.length == 0){
      console.log('consulta findAll');
      // this.service.findAll().subscribe(users => this.users = users);
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        console.log(page)
        this.service.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[]
          this.paginator = pageable;
          this.sharingData.pageUsersEventEmitter.emit({users: this.users, paginator: this.paginator});
        });
      })
    }

  }
  
  onRemoveUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe({
          next: () => {
            // Eliminar el usuario de la lista local
            this.users = this.users.filter(user => user.id !== id);
            
            Swal.fire(
              'Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
            
            // Emitir el evento para actualizar otros componentes si es necesario
            this.sharingData.idUserEventEmitter.emit(id);
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire(
              'Error!',
              'No se pudo eliminar el usuario.',
              'error'
            );
          }
        });
      }
    });
  }

  onSelectedUser(user: User): void {
   // this.sharingData.selectedUserEventEmitter.emit(user);
    this.router.navigate(['/users/edit', user.id] );
  }

  get admin() {
    return this.authService.isAdmin();
  }
  

}
