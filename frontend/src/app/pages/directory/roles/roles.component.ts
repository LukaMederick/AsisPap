import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { RolesService } from '../../../core/services/roles.service';

interface Role {
  id: string;
  name: string;
  guardName: string;
  permissions: string[];
  updatedAt: string;
}

interface Resource {
  id: number;
  name: string;
  permissions: string[];
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  constructor(private readonly rolesService: RolesService) {}

  showCreateForm: boolean = false;
  searchTerm: string = '';

  roles: Role[] = [];

  resources: Resource[] = [
    { id: 1, name: 'App\Models\Afd', permissions: ['Ver el listado de registros', 'Crear', 'Eliminar un registro en particular', 'Forzar eliminación de un registro en particular', 'Restaurar varios registros', 'Reordenar'] },
    { id: 2, name: 'App\Models\BiometricToken', permissions: ['Ver el listado de registros', 'Crear', 'Actualizar', 'Restaurar un registro en particular', 'Forzar eliminación de varios registros', 'Replicar'] },
    { id: 3, name: 'App\Models\Condition', permissions: ['Ver el listado de registros', 'Crear', 'Actualizar', 'Restaurar un registro en particular', 'Forzar eliminación de varios registros', 'Replicar'] },
    { id: 4, name: 'App\Models\Gestion', permissions: ['Ver el listado de registros', 'Crear', 'Actualizar', 'Restaurar varios registros', 'Reordenar'] },
    { id: 5, name: 'App\Models\Employee', permissions: ['Ver el listado de registros'] },
    { id: 6, name: 'App\Models\Leave', permissions: ['Ver el listado de registros'] }
  ];

  displayedColumns: string[] = ['name', 'guard', 'updatedAt', 'actions'];

  newRole: Role = {
    id: '0',
    name: '',
    guardName: 'web',
    permissions: [],
    updatedAt: new Date().toLocaleString()
  };

  // Control de modo edición
  isEditing: boolean = false;
  editingId: string = '';

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.rolesService.list().subscribe({
      next: (data) => {
        this.roles = data.map((r) => ({
          ...r,
          permissions: [],
          updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleString() : '-',
        }));
      },
      error: () => {
        this.roles = [];
      },
    });
  }

  get filteredRoles(): Role[] {
    if (!this.searchTerm) return this.roles;
    const term = this.searchTerm.toLowerCase();
    return this.roles.filter(r => r.name.toLowerCase().includes(term));
  }

  openCreateForm(): void {
    this.showCreateForm = true;
    this.newRole = { id: '0', name: '', guardName: 'web', permissions: [], updatedAt: new Date().toLocaleString() };
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  createRole(): void {
    if (this.newRole.name) {
      if (this.isEditing) {
        // Modo edición
        this.rolesService.update(this.editingId, {
          name: this.newRole.name,
          guardName: this.newRole.guardName,
          status: true,
        }).subscribe({
          next: () => {
            this.closeCreateForm();
            this.resetForm();
            this.loadRoles();
            alert('Rol actualizado exitosamente');
          },
          error: () => alert('No se pudo actualizar el rol'),
        });
      } else {
        // Modo creación
        this.rolesService.create({
          name: this.newRole.name,
          guardName: this.newRole.guardName,
          status: true,
        }).subscribe({
          next: () => {
            this.closeCreateForm();
            this.resetForm();
            this.loadRoles();
            alert('Rol creado exitosamente');
          },
          error: () => alert('No se pudo crear el rol'),
        });
      }
    } else {
      alert('Complete el nombre del rol');
    }
  }

  editRole(role: Role): void {
    this.isEditing = true;
    this.editingId = role.id;
    this.newRole = {
      id: role.id,
      name: role.name,
      guardName: role.guardName,
      permissions: role.permissions,
      updatedAt: role.updatedAt
    };
    this.showCreateForm = true;
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = '';
    this.newRole = { id: '0', name: '', guardName: 'web', permissions: [], updatedAt: new Date().toLocaleString() };
  }

  deleteRole(id: string): void {
    if (confirm('¿Eliminar este rol?')) {
      this.rolesService.remove(id).subscribe({
        next: () => this.loadRoles(),
        error: () => alert('No se pudo eliminar el rol'),
      });
    }
  }

  togglePermission(resourceId: number, permission: string, event: any): void {
    // Lógica para asignar/remover permisos
    console.log('Permiso:', permission, 'Seleccionado:', event.checked);
  }
}
