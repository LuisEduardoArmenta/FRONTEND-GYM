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
        path: 'users',
        component: UserComponent
    },

    {
        path: 'users/page/:page',
        component: UserComponent,
        canActivate: [authGuard]
    },

    {
        path: 'users/create',
        component: UserFormComponent,
        canActivate: [authGuard]
    },

    {
        path: 'users/edit/:id',
        component: UserFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: AuthComponent
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
        path: 'membresias',
        component: MembershipsComponent
    },

    {
        path: 'membresia',
        component: MembresiaComponent,
        canActivate: [authGuard]
    }

];
