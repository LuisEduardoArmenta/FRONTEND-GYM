import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from '../../register/register.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],    
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  users: User[] = [];
  paginator: any = {};

  constructor(
    private router: Router,
    private service: UserService,
    private sharingData: SharingDataService,
    private authService: AuthService,
    private route: ActivatedRoute,

  ) {
  }

  ngOnInit(): void {
    // this.service.findAll().subscribe(users => this.users = users);
    // this.route.paramMap.subscribe(params => {
    //   const page = +(params.get('page') || '0');
    //   console.log(page)
    //   // this.service.findAllPageable(page).subscribe(pageable => this.users = pageable.content as User[]);
    // })
    this.addUser();
    this.removeUser();
    this.findUserById();
    this.pageUsersEvent();
    this.handlerLogin();
    
  }

  handlerLogin() {
    this.sharingData.handlerLoginEventEmitter.subscribe(({username, password}) => {
      console.log('Intentando login con:', username); // Para debug
      
      this.authService.loginUser({username, password}).subscribe({
        next: response => {
          console.log('Respuesta del servidor:', response); // Para debug
          
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
          
          // Emitir la respuesta
          this.sharingData.setLoginResponse(response);
        },
        error: error => {
          console.error('Error en login:', error); // Para debug
          if(error.status == 401) {
            Swal.fire('Error en el login', error.error.message, 'error');
          } else {
            throw error;
          }
        }
      });
    });
  }

  pageUsersEvent(){
    this.sharingData.pageUsersEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator;
    });
  }

  findUserById() {
    this.sharingData.findUserByIdEventEmitter.subscribe(id => {

      const user = this.users.find(user => user.id == id);

      this.sharingData.selectUserEventEmitter.emit(user);
    })
  }

  addUser() {
    this.sharingData.newUserEventEmitter.subscribe(user => {

      if (user.id > 0) {
        this.service.update(user).subscribe(
          {
            next: (userUpdated) => {
              this.users = this.users.map(u => (u.id == userUpdated .id) ? {...userUpdated}: u)
              this.router.navigate(['/users'], {
                state:{
                  users: this.users
                , paginator: this.paginator 
              }});
              Swal.fire({
                title: "Actualizado!",
                text: "Usuario editado con exito!",
                icon: "success"
              });
            },
        error: (err) => {
          //console.log(err.error)
          if (err.status == 400) {

          this.sharingData.errorsUserFormEventEmitter.emit(err.error);
          }
      }
    });

      } else {

        this.service.create(user).subscribe( {
          next: userNew => {
          
          this.users = [... this.users, { ...userNew}];
          this.router.navigate(['/users'], {
            state: {
              users: this.users,
              paginator: this.paginator
            }});

          Swal.fire({
            title: "Creado nuevo usuario!",
            text: "Usuario creado con exito!",
            icon: "success"
          });
        },
      error: (err) => {
        //console.log(err.error)
        // console.log(err.status);
        if(err.status == 400){

        this.sharingData.errorsUserFormEventEmitter.emit(err.error);
        }
      }})
      }

    })
  }

  removeUser(): void {
    this.sharingData.idUserEventEmitter.subscribe(id => {
      Swal.fire({
        title: "¿Seguro que quiere eliminar?",
        text: "¡Cuidado! El usuario será eliminado del sistema",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.service.delete(id).subscribe({
            next: () => {
              this.users = this.users.filter(user => user.id !== id);
              this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
                this.router.navigate(['/users'], {
                  state: {
                    users: this.users,
                    paginator: this.paginator
                  }
                });
              });
              
              Swal.fire({
                title: "¡Eliminado!",
                text: "Usuario eliminado con éxito.",
                icon: "success"
              });
            },
            error: (error) => {
              console.error('Error al eliminar:', error);
              Swal.fire({
                title: "Error",
                text: "No se pudo eliminar el usuario.",
                icon: "error"
              });
            }
          });
        }
      });
    });
  }

}
