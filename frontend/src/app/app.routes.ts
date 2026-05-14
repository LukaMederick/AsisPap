import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { moduleGuard } from './core/guards/module.guard';
import { defaultHomeGuard } from './core/guards/default-home.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: '',
    loadComponent: () => import('./layout/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', canActivate: [defaultHomeGuard] },
      {
        path: 'no-access',
        loadComponent: () => import('./pages/no-access/no-access.component').then((m) => m.NoAccessComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        canActivate: [moduleGuard],
        data: { module: 'dashboard' }
      },

      {
        path: 'attendance/general',
        loadComponent: () => import('./pages/attendance/general/general.component').then((m) => m.GeneralComponent),
        canActivate: [moduleGuard],
        data: { module: 'attendance' }
      },
      {
        path: 'attendance/register',
        loadComponent: () => import('./pages/attendance/register/register.component').then((m) => m.RegisterComponent),
        canActivate: [moduleGuard],
        data: { module: 'attendance' }
      },
      {
        path: 'attendance/my-attendance',
        loadComponent: () => import('./pages/attendance/my-attendance/my-attendance.component').then((m) => m.MyAttendanceComponent),
        canActivate: [moduleGuard],
        data: { module: 'attendance' }
      },
      {
        path: 'attendance/schedules',
        loadComponent: () => import('./pages/attendance/schedules/schedules.component').then((m) => m.SchedulesComponent),
        canActivate: [moduleGuard],
        data: { module: 'attendance' }
      },

      {
        path: 'permissions/review',
        loadComponent: () => import('./pages/permissions/review/review.component').then((m) => m.ReviewComponent),
        canActivate: [moduleGuard],
        data: { module: 'permissions' }
      },
      {
        path: 'permissions/types',
        loadComponent: () => import('./pages/permissions/types/types.component').then((m) => m.TypesComponent),
        canActivate: [moduleGuard],
        data: { module: 'permissions' }
      },
      {
        path: 'permissions/all',
        loadComponent: () => import('./pages/permissions/all/all.component').then((m) => m.AllComponent),
        canActivate: [moduleGuard],
        data: { module: 'permissions' }
      },
      {
        path: 'permissions/create',
        loadComponent: () => import('./pages/permissions/create/create.component').then((m) => m.CreateComponent),
        canActivate: [moduleGuard],
        data: { module: 'permissions' }
      },

      {
        path: 'directory/offices',
        loadComponent: () => import('./pages/directory/offices/offices.component').then((m) => m.OfficesComponent),
        canActivate: [moduleGuard],
        data: { module: 'directory' }
      },
      {
        path: 'directory/users',
        loadComponent: () => import('./pages/directory/users/users.component').then((m) => m.UsersComponent),
        canActivate: [moduleGuard],
        data: { module: 'directory' }
      },
      {
        path: 'directory/roles',
        loadComponent: () => import('./pages/directory/roles/roles.component').then((m) => m.RolesComponent),
        canActivate: [moduleGuard],
        data: { module: 'directory' }
      },

      /** Ruta desconocida: vuelve al inicio según módulos (defaultHomeGuard en `''`). */
      { path: '**', redirectTo: '' }
    ]
  }
];
