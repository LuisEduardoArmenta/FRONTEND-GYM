import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-2 bg-dark min-vh-100">
          <div class="d-flex flex-column p-3 text-white">
            <h2>Admin Panel</h2>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
              <li class="nav-item">
                <a routerLink="/users" class="nav-link text-white">
                  Gestión de Usuarios
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/inventario" class="nav-link text-white">
                  Inventario
                </a>
              </li>
              <!-- Más opciones de admin -->
            </ul>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="col-md-10 p-4">
          <h1>Dashboard Administrativo</h1>
          <!-- Aquí puedes agregar estadísticas, gráficos, etc. -->
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}
