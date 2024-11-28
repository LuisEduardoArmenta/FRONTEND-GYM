import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  @Input() users: User[] = [];
  @Input() paginator = {};
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}



  get login(){
    return this.authService.user;
  }

  get admin(){
    return this.authService.isAdmin();  
  }

  handlerLogout(){
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
