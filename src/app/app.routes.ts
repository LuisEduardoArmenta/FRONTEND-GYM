import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { AuthComponent } from './components/auth/auth.component';
import { authGuard } from './guards/auth.guard';
import { Forbidden403Component } from './components/forbidden403/forbidden403.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './views/home/home.component';
import { MembershipsComponent } from './views/memberships/memberships.component';
import { MembresiaComponent } from './components/membresias/membresia/membresia.component';
import { MembresiaFormComponent } from './components/membresias/membresia-form/membresia-form.component';
import { PlanComponent } from './components/membresias/planes/plan/plan.component';
import { PlanFormComponent } from './components/membresias/planes/plan-form/plan-form.component';
import { VentasComponent } from './components/ventas/ventas/ventas.component';
import { VentasFormComponent } from './components/ventas/ventas-form/ventas-form.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { InventarioFormComponent } from './components/inventario/inventario-form/inventario-form.component';
import { UserDashboardComponent } from './users/user-dashboard/user-dashboard.component';
import { TrainingPlansComponent } from './users/training-plans/training-plans.component';
import { ControlCajaComponent } from './components/control-caja/control-caja.component';
import { ResetPasswordComponent } from './reset-password/reset-password/reset-password.component';
import { QrGeneratorComponent } from './components/qr-generator/qr-generator.component';
import { AccessControlComponent } from './components/access-control/access-control.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: AuthComponent
    },

    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'forbidden',
        component: Forbidden403Component
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'membresiasinfo',
        component: MembershipsComponent
    },
    {
        path: 'users',
        component: UserComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'users/page/:page',
        component: UserComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'users/create',
        component: UserFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'users/edit/:id',
        component: UserFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },

    {
        path: 'membresia',
        component: MembresiaComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'membresia/crear',
        component: MembresiaFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'membresia/editar/:id',
        component: MembresiaFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'membresia/page/:page',
        component: MembresiaComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'membresia/planes',
        component: PlanComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'membresia/planes/crear',
        component: PlanFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'membresia/planes/editar/:id',
        component: PlanFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'ventas',
        component: VentasComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'ventas/crear',
        component: VentasFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'ventas/editar/:id',
        component: VentasFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'inventario',
        component: InventarioComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'inventario/crear',
        component: InventarioFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },
    {
        path: 'inventario/editar/:id',
        component: InventarioFormComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },


    {
        path: 'control-caja',
        component: ControlCajaComponent,
        canActivate: [authGuard],
        data: { role: 'ADMIN' }
    },

    {
        path: 'user/dashboard',
        component: UserDashboardComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }
    },
    {
        path: 'user/entrenamientos',
        component: TrainingPlansComponent,
        canActivate: [authGuard],
        data: { role: 'USER' }
    },
    {
        path: 'access-control',
        loadComponent: () => import('./components/access-control/access-control.component')
            .then(m => m.AccessControlComponent)
    },
    {
        path: 'qr-generator',
        component: QrGeneratorComponent
    }

];
