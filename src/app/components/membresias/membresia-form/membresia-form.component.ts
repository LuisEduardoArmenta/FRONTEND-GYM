import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MembresiaService } from '../../../services/membresia.service';
import { UserService } from '../../../services/user.service';
import { PlanService } from '../../../services/plan.service';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-membresia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './membresia-form.component.html',
  styleUrl: './membresia-form.component.css'
})
export class MembresiaFormComponent implements OnInit {
  title: string = 'Crear Membresía';
  membresia: any = {
    usuario: null,
    plan: null,
    fechaInicio: this.formatDate(new Date()),
    fechaExpiracion: this.formatDate(new Date()),
    estadoMembresia: 'ACTIVO'
  };
  usuarios: User[] = [];
  planes: any[] = [];
  errors: string[] = [];
  editando: boolean = false;

  constructor(
    private membresiaService: MembresiaService,
    private userService: UserService,
    private planService: PlanService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPlanes();
    this.cargarMembresia();
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  cargarUsuarios(): void {
    this.userService.findAll().subscribe({
      next: (users: User[]) => {
        this.usuarios = users;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  cargarPlanes(): void {
    this.planService.getPlanes().subscribe({
      next: (planes) => {
        this.planes = planes;
      },
      error: (err) => {
        console.error('Error al cargar planes:', err);
        Swal.fire('Error', 'No se pudieron cargar los planes', 'error');
      }
    });
  }

  cargarMembresia(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.editando = true;
        this.title = 'Editar Membresía';
        this.membresiaService.getMembresia(id).subscribe({
          next: (membresia) => {
            this.membresia = {
              ...membresia,
              fechaInicio: this.formatDate(new Date(membresia.fechaInicio)),
              fechaExpiracion: this.formatDate(new Date(membresia.fechaExpiracion))
            };
          },
          error: (err) => {
            console.error('Error al cargar membresía:', err);
            Swal.fire('Error', 'No se pudo cargar la membresía', 'error');
          }
        });
      }
    });
  }

  onSubmit(): void {
    const membresiaToSend = {
      ...this.membresia,
      fechaInicio: new Date(this.membresia.fechaInicio).toISOString(),
      fechaExpiracion: new Date(this.membresia.fechaExpiracion).toISOString()
    };

    if (this.membresia.id) {
      this.membresiaService.updateMembresia(this.membresia.id, membresiaToSend).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Membresía actualizada correctamente', 'success');
          this.router.navigate(['/membresia']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          if (err.error?.errors) {
            this.errors = err.error.errors;
          } else {
            Swal.fire('Error', 'No se pudo actualizar la membresía', 'error');
          }
        }
      });
    } else {
      this.membresiaService.createMembresia(membresiaToSend).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Membresía creada correctamente', 'success');
          this.router.navigate(['/membresia']);
        },
        error: (err) => {
          console.error('Error al crear:', err);
          if (err.error?.errors) {
            this.errors = err.error.errors;
          } else {
            Swal.fire('Error', 'No se pudo crear la membresía', 'error');
          }
        }
      });
    }
  }

  onClose(): void {
    this.router.navigate(['/membresia']);
  }

  compareUsuario(u1: any, u2: any): boolean {
    return u1 && u2 ? u1.id === u2.id : u1 === u2;
  }

  comparePlan(p1: any, p2: any): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
}
