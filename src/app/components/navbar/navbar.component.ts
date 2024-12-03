import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() paginator = {};
  userInfo: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userInfo = this.authService.user.user;
  }

  get login() {
    return {
      ...this.authService.user,
      user: this.userInfo
    };
  }

  get admin() {
    return this.authService.isAdmin();  
  }

  get username() {
    return this.userInfo.username || 'Usuario';
  }

  get email() {
    return this.userInfo.email || 'usuario@email.com';
  }

  handlerLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
