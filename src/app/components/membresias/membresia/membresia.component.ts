import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MembresiaService } from '../../../services/membresia.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../navbar/navbar.component';
import { PlanComponent } from "../planes/plan/plan.component";

@Component({
  selector: 'app-membresia',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, PlanComponent],
  templateUrl: './membresia.component.html',
  styleUrl: './membresia.component.css'
})
export class MembresiaComponent implements OnInit {
  membresias: any[] = [];
  loading: boolean = true;

  constructor(
    private membresiaService: MembresiaService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarMembresias();
  }

  cargarMembresias(): void {
    this.loading = true;
    this.membresiaService.getMembresias().subscribe({
      next: (data) => {
        this.membresias = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  eliminarMembresia(id: number): void {
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
        this.membresiaService.deleteMembresia(id).subscribe({
          next: () => {
            this.membresias = this.membresias.filter(m => m.idMembresia !== id);
            Swal.fire('¡Eliminado!', 'La membresía ha sido eliminada.', 'success');
            this.router.navigate(['/membresia']);
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar la membresía', 'error');
          }
        });
      }
    });
  }

  editarMembresia(id: number): void {
    this.router.navigate(['/membresia/editar', id]);
  }

  crearMembresia(): void {
    this.router.navigate(['/membresia/crear']);
  }

  get admin(): boolean {
    return this.authService.isAdmin();
  }
}