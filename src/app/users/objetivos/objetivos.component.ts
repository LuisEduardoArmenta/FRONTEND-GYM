import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user.component';

interface Objetivo {
  id: number;
  titulo: string;
  descripcion: string;
  fechaLimite: string;
  progreso: number;
  completado: boolean;
  categoria: 'peso' | 'fuerza' | 'resistencia' | 'nutricion';
}

@Component({
  selector: 'app-objetivos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarUserComponent],
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css']
})
export class ObjetivosComponent implements OnInit {
  objetivos: Objetivo[] = [];
  nuevoObjetivo: Objetivo = this.inicializarObjetivo();
  categorias = ['peso', 'fuerza', 'resistencia', 'nutricion'];
  modoEdicion: boolean = false;

  ngOnInit() {
    // Aquí cargaríamos los objetivos desde un servicio
    this.objetivos = [
      {
        id: 1,
        titulo: 'Bajar de peso',
        descripcion: 'Alcanzar 75kg',
        fechaLimite: '2024-12-31',
        progreso: 60,
        completado: false,
        categoria: 'peso'
      },
      // ... más objetivos de ejemplo
    ];
  }

  inicializarObjetivo(): Objetivo {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaLimite: '',
      progreso: 0,
      completado: false,
      categoria: 'peso'
    };
  }

  agregarObjetivo() {
    if (this.nuevoObjetivo.titulo && this.nuevoObjetivo.fechaLimite) {
      this.nuevoObjetivo.id = this.objetivos.length + 1;
      this.objetivos.push({...this.nuevoObjetivo});
      this.nuevoObjetivo = this.inicializarObjetivo();
    }
  }

  actualizarProgreso(objetivo: Objetivo, progreso: number) {
    objetivo.progreso = progreso;
    if (progreso === 100) {
      objetivo.completado = true;
    }
  }

  eliminarObjetivo(id: number) {
    this.objetivos = this.objetivos.filter(obj => obj.id !== id);
  }

  getProgresoClase(progreso: number): string {
    if (progreso < 30) return 'bg-danger';
    if (progreso < 70) return 'bg-warning';
    return 'bg-success';
  }
}
