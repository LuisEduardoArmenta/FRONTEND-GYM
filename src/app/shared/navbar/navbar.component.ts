import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  logoPath: string;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.logoPath = '/images/logoazul.png';
  }

  ngOnInit() {
    // Verifica si la imagen existe
    const img = new Image();
    img.onerror = () => {
      console.error('Error cargando la imagen:', this.logoPath);
    };
    img.src = this.logoPath;
  }

  get isLoggedIn(): boolean {
    return this.authService.authenticated();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
