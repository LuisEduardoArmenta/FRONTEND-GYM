import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';
import { ObjetivoService } from '../../services/objetivo.service';
import { AuthService } from '../../services/auth.service';
import { Objetivo } from '../../models/objetivo.model';

@Component({
  selector: 'app-objetivos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarUserComponent
  ],
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css']
})
export class ObjetivosComponent implements OnInit {
  objetivos: Objetivo[] = [];
  nuevoObjetivo: Objetivo = this.inicializarObjetivo();
  userId: number;

  constructor(
    private objetivoService: ObjetivoService,
    private authService: AuthService
  ) {
    this.userId = 1;
  }

  ngOnInit() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible');
      // Redirigir al login si no hay token
      return;
    }
    this.cargarObjetivos();
  }

  cargarObjetivos() {
    if (this.userId) {
      console.log('Cargando objetivos para usuario:', this.userId);
      this.objetivoService.getObjetivosByUserId(this.userId)
        .subscribe({
          next: (objetivos) => {
            console.log('Objetivos cargados:', objetivos);
            this.objetivos = objetivos;
          },
          error: (error) => {
            console.error('Error al cargar objetivos:', error);
          }
        });
    }
  }

  inicializarObjetivo(): Objetivo {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaLimite: '',
      progreso: 0,
      completado: false,
      categoria: 'peso',
      userId: this.userId
    };
  }

  agregarObjetivo() {
    if (this.nuevoObjetivo.titulo && this.nuevoObjetivo.fechaLimite) {
      this.objetivoService.crearObjetivo(this.nuevoObjetivo)
        .subscribe(objetivo => {
          this.objetivos.unshift(objetivo);
          this.nuevoObjetivo = this.inicializarObjetivo();
        });
    }
  }

  actualizarProgreso(objetivo: Objetivo, progreso: number) {
    this.objetivoService.actualizarProgreso(objetivo.id, progreso)
      .subscribe(() => {
        objetivo.progreso = progreso;
        objetivo.completado = progreso >= 100;
      });
  }

  eliminarObjetivo(id: number) {
    this.objetivoService.eliminarObjetivo(id)
      .subscribe(() => {
        this.objetivos = this.objetivos.filter(obj => obj.id !== id);
      });
  }

  getProgresoClase(progreso: number): string {
    if (progreso < 30) return 'bg-danger';
    if (progreso < 70) return 'bg-warning';
    return 'bg-success';
  }
}
