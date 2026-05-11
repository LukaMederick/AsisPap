import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PermissionTypesService } from '../../../core/services/permission-types.service';

interface PermissionType {
  id: string;
  name: string;
  color: string;
  icon: string;
  status: boolean;
}

@Component({
  selector: 'app-types',
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
    MatSelectModule,
    MatSlideToggleModule
  ],
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent {
  constructor(private readonly permissionTypesService: PermissionTypesService) {}

  displayedColumns: string[] = ['name', 'color', 'icon', 'status', 'actions'];

  permissionTypes: PermissionType[] = [];

  // Nuevo tipo de papeleta
  newType: PermissionType = {
    id: '0',
    name: '',
    color: '#1976d2',
    icon: '',
    status: true
  };

  // Control de modo edición
  isEditing: boolean = false;
  editingId: string = '';

  // Lista de iconos disponibles
  availableIcons: string[] = [
    'person', 'work', 'school', 'menu_book', 'health_and_safety',
    'apartment', 'verified', 'pending', 'gavel', 'how_to_reg',
    'event', 'schedule', 'assignment', 'description', 'folder'
  ];

  ngOnInit(): void {
    this.loadTypes();
  }

  private loadTypes(): void {
    this.permissionTypesService.list().subscribe({
      next: (data) => {
        this.permissionTypes = data;
      },
      error: () => {
        this.permissionTypes = [];
      },
    });
  }

  addType(): void {
    if (this.newType.name.trim()) {
      if (this.isEditing) {
        // Modo edición
        this.permissionTypesService.update(this.editingId, {
          name: this.newType.name,
          color: this.newType.color,
          icon: this.newType.icon,
          status: this.newType.status,
        }).subscribe({
          next: () => {
            this.resetForm();
            this.loadTypes();
            alert('Tipo de papeleta actualizado');
          },
          error: () => alert('No se pudo actualizar el tipo de papeleta'),
        });
      } else {
        // Modo creación
        this.permissionTypesService.create({
          name: this.newType.name,
          color: this.newType.color,
          icon: this.newType.icon,
          status: this.newType.status,
        }).subscribe({
          next: () => {
            this.resetForm();
            this.loadTypes();
            alert('Tipo de papeleta creado');
          },
          error: () => alert('No se pudo crear tipo de papeleta'),
        });
      }
    } else {
      alert('Ingrese un nombre');
    }
  }

  editType(type: PermissionType): void {
    this.isEditing = true;
    this.editingId = type.id;
    this.newType = {
      id: type.id,
      name: type.name,
      color: type.color,
      icon: type.icon,
      status: type.status
    };
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = '';
    this.newType = { id: '0', name: '', color: '#1976d2', icon: '', status: true };
  }

  deleteType(id: string): void {
    if (confirm('¿Eliminar este tipo de papeleta?')) {
      this.permissionTypesService.remove(id).subscribe({
        next: () => this.loadTypes(),
        error: () => alert('No se pudo eliminar el tipo'),
      });
    }
  }

  toggleStatus(type: PermissionType): void {
    this.permissionTypesService.update(type.id, { status: !type.status }).subscribe({
      next: () => this.loadTypes(),
      error: () => alert('No se pudo actualizar estado'),
    });
  }
}
