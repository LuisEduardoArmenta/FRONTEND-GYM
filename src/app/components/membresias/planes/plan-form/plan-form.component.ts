import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Plan } from '../../../../models/plan';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../../../../services/plan.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css']
})
export class PlanFormComponent implements OnInit {
  plan: Plan = new Plan();
  errors: string[] = [];
  submitted = false;
  editando = false;
  formChanged = false;
  originalPlan: Plan = new Plan();

  constructor(
    private route: ActivatedRoute,
    private service: PlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.editando = true;
        this.service.findById(id).subscribe({
          next: (plan) => {
            this.plan = {...plan};
            this.originalPlan = {...plan};
            this.formChanged = false;
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo cargar el plan', 'error');
          }
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.formChanged && this.editando) {
      Swal.fire('Info', 'No se han realizado cambios', 'info');
      return;
    }

    const operation = this.editando ? 
      this.service.update(this.plan.idPlan!, this.plan) : 
      this.service.create(this.plan);

    operation.subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: `Plan ${this.editando ? 'actualizado' : 'creado'} correctamente`,
          icon: 'success'
        }).then(() => {
          this.router.navigate(['/membresia']);
        });
      },
      error: (err) => {
        console.error(err);
        if (err.status === 400 && err.error?.errors) {
          this.errors = err.error.errors;
        } else {
          Swal.fire('Error', `No se pudo ${this.editando ? 'actualizar' : 'crear'} el plan`, 'error');
        }
      }
    });
  }

  onInputChange() {
    if (this.editando) {
      const currentPlan = {
        nombre: this.plan.nombre,
        descripcion: this.plan.descripcion,
        precio: this.plan.precio,
        duracion: this.plan.duracion,
        beneficios: this.plan.beneficios
      };
      
      const originalPlanCopy = {
        nombre: this.originalPlan.nombre,
        descripcion: this.originalPlan.descripcion,
        precio: this.originalPlan.precio,
        duracion: this.originalPlan.duracion,
        beneficios: this.originalPlan.beneficios
      };
      
      this.formChanged = !this.areObjectsEqual(currentPlan, originalPlanCopy);
    } else {
      this.formChanged = true;
    }
  }

  private areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  onClose() {
    this.router.navigate(['/membresia']);
  }

  onClear(form: NgForm) {
    this.plan = new Plan();
    this.errors = [];
    this.submitted = false;
    this.formChanged = false;
    form.resetForm();
  }

  addBeneficio() {
    this.plan.beneficios.push('');
    this.onInputChange();
  }

  removeBeneficio(index: number) {
    this.plan.beneficios.splice(index, 1);
    this.onInputChange();
  }
}
