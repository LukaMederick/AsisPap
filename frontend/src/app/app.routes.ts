import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/attendance/general', pathMatch: 'full' },

  // Asistencia
  { path: 'attendance/general', loadComponent: () => import('./pages/attendance/general/general.component').then(m => m.GeneralComponent) },
  { path: 'attendance/register', loadComponent: () => import('./pages/attendance/register/register.component').then(m => m.RegisterComponent) },
  { path: 'attendance/my-attendance', loadComponent: () => import('./pages/attendance/my-attendance/my-attendance.component').then(m => m.MyAttendanceComponent) },
  { path: 'attendance/schedules', loadComponent: () => import('./pages/attendance/schedules/schedules.component').then(m => m.SchedulesComponent) },

  // Papeletas
  { path: 'permissions/review', loadComponent: () => import('./pages/permissions/review/review.component').then(m => m.ReviewComponent) },
  { path: 'permissions/types', loadComponent: () => import('./pages/permissions/types/types.component').then(m => m.TypesComponent) },
  { path: 'permissions/all', loadComponent: () => import('./pages/permissions/all/all.component').then(m => m.AllComponent) },
  { path: 'permissions/create', loadComponent: () => import('./pages/permissions/create/create.component').then(m => m.CreateComponent) },

  // Directorio
  { path: 'directory/offices', loadComponent: () => import('./pages/directory/offices/offices.component').then(m => m.OfficesComponent) },
  { path: 'directory/users', loadComponent: () => import('./pages/directory/users/users.component').then(m => m.UsersComponent) },
  { path: 'directory/roles', loadComponent: () => import('./pages/directory/roles/roles.component').then(m => m.RolesComponent) }
];
