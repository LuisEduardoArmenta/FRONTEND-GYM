import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plan } from '../../../../models/plan';
import { PlanService } from '../../../../services/plan.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  planes: Plan[] = [];

  constructor(
    private planService: PlanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.planService.findAll().subscribe({
      next: (response) => {
        console.log('Planes cargados:', response);
        this.planes = response;
      },
      error: (e) => {
        console.error('Error al cargar planes:', e);
        Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
      }
    });
  }

  crearPlan(): void {
    this.router.navigate(['/membresia/planes/crear']);
  }

  editarPlan(idPlan: number): void {
    this.router.navigate(['/membresia/planes/editar', idPlan]);
  }

  eliminarPlan(idPlan: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.planService.delete(idPlan).subscribe({
          next: () => {
            this.planes = this.planes.filter(p => p.idPlan !== idPlan);
            Swal.fire('¡Eliminado!', 'El plan ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el plan', 'error');
          }
        });
      }
    });
  }
}
