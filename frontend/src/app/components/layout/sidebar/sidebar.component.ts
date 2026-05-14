import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import type { AppModule } from '../../../core/models/app-module';

export interface SidebarNavItem {
  path: string;
  label: string;
  icon: string;
  module: AppModule;
}

export interface SidebarNavSection {
  title: string | null;
  items: SidebarNavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  readonly auth = inject(AuthService);

  readonly sections: readonly SidebarNavSection[] = [
    {
      title: null,
      items: [{ path: '/dashboard', label: 'Dashboard', icon: 'dashboard', module: 'dashboard' }]
    },
    {
      title: 'Gestión de Asistencia',
      items: [
        { path: '/attendance/general', label: 'Asistencia general', icon: 'assignment', module: 'attendance' },
        { path: '/attendance/register', label: 'Registro de asistencia', icon: 'edit_calendar', module: 'attendance' },
        { path: '/attendance/my-attendance', label: 'Mi asistencia', icon: 'person', module: 'attendance' },
        { path: '/attendance/schedules', label: 'Horarios', icon: 'schedule', module: 'attendance' }
      ]
    },
    {
      title: 'Gestión de Papeletas',
      items: [
        { path: '/permissions/review', label: 'Revisión de papeleta', icon: 'rate_review', module: 'permissions' },
        { path: '/permissions/types', label: 'Tipos de papeletas', icon: 'category', module: 'permissions' },
        { path: '/permissions/all', label: 'Papeletas', icon: 'inbox', module: 'permissions' },
        { path: '/permissions/create', label: 'Crear papeleta', icon: 'add_circle_outline', module: 'permissions' }
      ]
    },
    {
      title: 'Directorio',
      items: [
        { path: '/directory/offices', label: 'Oficinas', icon: 'business', module: 'directory' },
        { path: '/directory/users', label: 'Usuarios', icon: 'people', module: 'directory' },
        { path: '/directory/roles', label: 'Roles', icon: 'badge', module: 'directory' }
      ]
    }
  ];

  sectionHasVisibleItems(section: SidebarNavSection): boolean {
    return section.items.some((i) => this.auth.hasModule(i.module));
  }
}
