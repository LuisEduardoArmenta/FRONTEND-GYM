import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.css']
})
export class SidebarUserComponent implements OnInit {
  userInfo: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userInfo = this.authService.user.user;
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
